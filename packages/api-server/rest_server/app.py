import asyncio
import logging
import os
import sys

import socketio
from fastapi import FastAPI

from .app_config import app_config
from .building_map import building_map_router

logger = logging.getLogger("rest_app")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(handler)
if "RMF_REST_SERVER_DEBUG" in os.environ:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

app = FastAPI()
sio = socketio.AsyncClient()


@app.on_event("startup")
async def on_startup():
    await sio.connect(app_config.api_server_url)
    connected = asyncio.Future()
    sio.on("connect", lambda: connected.set_result(True))
    await connected
    del sio.handlers["/"]["connect"]

    app.include_router(
        building_map_router(sio, logger.getChild("building_map")),
        prefix="/building_map",
    )

    logger.info("started app")


# There is a bug with uvicorn and socketio that causes
# `RuntimeError: Event loop stopped before Future completed.`
# when getting SIGINT, the reason is because both uvicorn and socketio installs signal
# handlers, socketio's handler overwrites uvicorn's and in its handler to calls `asyncio.get_event_loop().stop()`.
# This forces the event loop to stop before uvicorn completes its work, hence the error appears.
# The side effect is that the shutdown handler is never called because the loop has
# been stopped.
@app.on_event("shutdown")
async def on_shutdown():
    await sio.disconnect()
    logger.info("shutdown app")
