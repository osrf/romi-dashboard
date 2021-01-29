import asyncio
import base64
import hashlib
import os
from logging import Logger
from typing import Optional

import rclpy
from building_map_msgs.msg import AffineImage, BuildingMap, Level
from rosidl_runtime_py.convert import message_to_ordereddict

from fastapi import APIRouter, HTTPException

from ..repositories.static_files import StaticFilesRepository


def building_map_router(ros2_node: rclpy.node.Node, repo: StaticFilesRepository, logger: Logger):
    router = APIRouter()

    building_map: Optional[BuildingMap] = None
    building_map_sub: rclpy.subscription.Subscription

    @router.on_event('startup')
    async def on_startup():
        loop = asyncio.get_running_loop()

        def _update_building_map(new_building_map):
            nonlocal building_map
            building_map = new_building_map
            logger.info(f'updated building map "{building_map["name"]}"')

        def _on_building_map(rmf_building_map: BuildingMap):
            '''
            1. Converts a `BuildingMap` message to an ordered dict.
            2. Saves the images into `{static_directory}/{map_name}/`.
            3. Change the `AffineImage` `data` field to the url of the image.
            '''
            logger.info(
                f'received new building map "{rmf_building_map.name}"')
            # this is inefficient as it converts a large bytearray to a list of numbers, but
            # there isn't any better alternatives
            building_map = message_to_ordereddict(rmf_building_map)
            for i in range(len(rmf_building_map.levels)):
                level: Level = rmf_building_map.levels[i]
                for j in range(len(level.images)):
                    image: AffineImage = level.images[j]
                    # look at non-crypto hashes if we need more performance
                    sha1_hash = hashlib.sha1()
                    sha1_hash.update(image.data)
                    fingerprint = base64.b32encode(
                        sha1_hash.digest()).lower().decode()
                    relpath = f'{rmf_building_map.name}/{level.name}-{image.name}.{fingerprint}.{image.encoding}'
                    (filepath, urlpath) = repo.add_file(image.data, relpath)
                    logger.info(f'saved map image to "{filepath}"')
                    building_map['levels'][i]['images'][j]['data'] = urlpath
            nonlocal loop
            loop.call_soon_threadsafe(_update_building_map, building_map)

        nonlocal building_map_sub
        building_map_sub = ros2_node.create_subscription(
            BuildingMap,
            'map',
            _on_building_map,
            rclpy.qos.QoSProfile(
                history=rclpy.qos.HistoryPolicy.KEEP_LAST,
                depth=1,
                reliability=rclpy.qos.ReliabilityPolicy.RELIABLE,
                durability=rclpy.qos.DurabilityPolicy.TRANSIENT_LOCAL))
        logger.info('subscribed to "map"')

    @router.on_event('shutdown')
    async def on_shutdown():
        if building_map_sub:
            building_map_sub.destroy()

    @router.get('')
    async def get_building_map():
        if not building_map:
            raise HTTPException(503, 'map unavailable')
        return building_map

    return router
