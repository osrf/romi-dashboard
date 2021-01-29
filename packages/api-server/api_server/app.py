import logging
import os
import sys
import threading

import rclpy
from rclpy.node import Node

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .building_map import building_map_router
from .repositories.static_files import StaticFilesRepository


class MainNode(Node):
    def __init__(self):
        super().__init__('rmf_api_server')


def ros2_thread(node):
    print('entering ros2 thread')
    rclpy.spin(node)
    print('leaving ros2 thread')


static_path = '/static'
static_directory = 'static'

logger = logging.getLogger('app')
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(handler)
logger.setLevel(logging.INFO)

app = FastAPI()
os.makedirs(static_directory, exist_ok=True)
static_files = StaticFiles(directory=static_directory)
app.mount(static_path, static_files, name='static')
static_files_repo = StaticFilesRepository(static_path, static_directory)
ros2_node: Node


@app.on_event('startup')
def start_rclpy():
    global ros2_node
    rclpy.init(args=None)
    ros2_node = MainNode()
    threading.Thread(target=ros2_thread, args=[ros2_node]).start()

    app.include_router(
        building_map_router(ros2_node, static_files_repo, logger.getChild('building_map')),
        prefix='/building_map')


@app.on_event('shutdown')
def shutdown_rclpy():
    rclpy.shutdown()
