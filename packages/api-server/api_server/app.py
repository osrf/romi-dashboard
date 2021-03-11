import logging
import os
import sys
import threading

import socketio

import rclpy
from rclpy.node import Node
from tortoise import Tortoise

from .app_config import app_config
from .repositories import RmfRepository, SqlRepository, StaticFilesRepository
from .rmf_io import HealthWatchdog, RmfBookKeeper, RmfGateway, RmfIO, RmfTransport


class MainNode(Node):
    def __init__(self):
        super().__init__("rmf_api_server")


def ros2_thread(node):
    print("entering ros2 thread")
    rclpy.spin(node)
    print("leaving ros2 thread")


async def init_tortoise():
    await Tortoise.init(
        db_url=app_config.db_url, modules={"models": ["api_server.models"]}
    )
    await Tortoise.generate_schemas()


logger = logging.getLogger("app")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(handler)
if "RMF_API_SERVER_DEBUG" in os.environ:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

sio_client = socketio.AsyncClient()


async def load_states(repo: RmfRepository, gateway: RmfGateway):
    logger.info("loading states from database...")

    door_states = await repo.read_door_states()
    for state in door_states:
        gateway.door_states.on_next(state)
    logger.info(f"loaded {len(door_states)} door states")

    logger.info("successfully loaded all states")


async def on_startup():
    await init_tortoise()

    rclpy.init(args=None)
    ros2_node = MainNode()

    os.makedirs(app_config.static_directory, exist_ok=True)
    static_files_repo = StaticFilesRepository(
        app_config.static_path,
        app_config.static_directory,
        logger.getChild("static_files"),
    )

    sql_repo = SqlRepository(logger.getChild("SqlRepository"))
    rmf_gateway = RmfGateway()
    await load_states(sql_repo, rmf_gateway)
    rmf_io = RmfIO(  # pylint: disable=unused-variable
        sio, rmf_gateway, static_files_repo, logger=logger.getChild("RmfIO")
    )

    HealthWatchdog(rmf_gateway, logger=logger.getChild("HealthWatchdog"))

    rmf_transport = RmfTransport(ros2_node, rmf_gateway)
    rmf_transport.subscribe_all()

    rmf_bookkeeper = RmfBookKeeper(
        rmf_gateway, sql_repo, logger=logger.getChild("BookKeeper")
    )
    rmf_bookkeeper.start()

    threading.Thread(target=ros2_thread, args=[ros2_node]).start()
    logger.info("started app")


async def on_shutdown():
    rclpy.shutdown()
    await Tortoise.close_connections()
    logger.info("shutdown app")


sio = socketio.AsyncServer(async_mode="asgi")
app = socketio.ASGIApp(
    sio,
    static_files={app_config.static_path: app_config.static_directory},
    on_startup=on_startup,
    on_shutdown=on_shutdown,
)
