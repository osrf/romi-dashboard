import asyncio
import os
from logging import Logger
from typing import Optional

from api_server.rmf_io import topics
from fastapi import APIRouter, HTTPException
from socketio.asyncio_client import AsyncClient as SioAsyncClient


def building_map_router(sio_client: SioAsyncClient, logger: Logger):
    router = APIRouter()
    building_map: Optional[dict] = None

    @router.on_event("startup")
    async def on_startup():
        await sio_client.emit("subscribe", topics.building_map)

    @sio_client.on(topics.building_map)
    def on_building_map(building_map_: dict):
        nonlocal building_map
        building_map = building_map_
        logger.info("got new building map")

    @router.get("")
    async def get_building_map():
        if not building_map:
            raise HTTPException(503, "map unavailable")
        return building_map

    return router
