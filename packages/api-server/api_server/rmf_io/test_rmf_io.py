import unittest
import asyncio
import os.path
from datetime import datetime

import socketio
import aiohttp.web

from rosidl_runtime_py.convert import message_to_ordereddict
from builtin_interfaces.msg import Time
from building_map_msgs.msg import BuildingMap, Level, AffineImage, Graph
from rmf_door_msgs.msg import DoorState, DoorMode

from .rmf_io import RmfIO
from .gateway import RmfGateway
from .topics import topics
from ..repositories.static_files import StaticFilesRepository


def make_door_state(name: str, mode: int = DoorMode.MODE_CLOSED) -> DoorState:
    return DoorState(
        door_name=name,
        current_mode=DoorMode(value=mode),
        door_time=Time(sec=0, nanosec=0),
    )


def make_building_map():
    with open(f'{os.path.dirname(__file__)}/test_data/office.png', 'br') as f:
        image_data = f.read()

    return BuildingMap(
        name='test_name',
        levels=[
            Level(
                name='L1',
                elevation=0.0,
                images=[AffineImage(
                    name='test_image',
                    x_offset=0.0,
                    y_offset=0.0,
                    yaw=0.0,
                    scale=1.0,
                    encoding='png',
                    data=image_data,
                )],
                places=[],
                doors=[],
                nav_graphs=[],
                wall_graph=Graph(
                    name='test_graph',
                    vertices=[],
                    edges=[],
                    params=[],
                ),
            ),
        ],
        lifts=[],
    )


class TestRmfIO(unittest.IsolatedAsyncioTestCase):
    async def make_client(self, topic: str):
        client = client = socketio.AsyncClient()
        self.clients.append(client)
        await client.connect('http://localhost:8080')
        fut = asyncio.Future()
        client.on('connect', lambda: fut.set_result(None))
        await fut
        await client.emit('subscribe', topic)
        return client

    async def asyncSetUp(self):
        self.clients = []
        self.rmf_gateway = RmfGateway()
        self.sio = socketio.AsyncServer(async_mode='aiohttp')
        self.static_files_dir = f'{os.path.dirname(os.path.dirname(os.path.dirname(__file__)))}/test_artifacts'
        self.static_files = StaticFilesRepository(
            '/static', self.static_files_dir)
        self.rmf_io = RmfIO(self.sio, self.rmf_gateway, self.static_files)
        self.app = aiohttp.web.Application()
        self.sio.attach(self.app)
        self.runner = aiohttp.web.AppRunner(self.app)
        await self.runner.setup()
        self.site = aiohttp.web.TCPSite(self.runner, 'localhost', 8080)
        await self.site.start()

    async def asyncTearDown(self):
        asyncio.gather(*[client.disconnect() for client in self.clients])
        self.clients.clear()
        await self.runner.cleanup()

    async def test_door_states(self):
        '''
        test receiving door states events
        '''
        done = asyncio.Future()
        test_names = ['test_door', 'test_door_2']
        test_states = [make_door_state(name) for name in test_names]
        received_states = {}
        client = await self.make_client(topics.door_states)

        def on_door_states(door_state):
            received_states[door_state['door_name']] = door_state
            if len(received_states) == len(test_states) and \
                    all([x in test_names for x in received_states.keys()]):
                done.set_result(True)
        client.on(topics.door_states, on_door_states)

        [self.rmf_gateway.door_states.on_next(x) for x in test_states]
        await asyncio.wait_for(done, 1)
        received_states = {}

        # test that a new client receives all the current states on subscribe
        done = asyncio.Future()
        client = await self.make_client(topics.door_states)
        client.on(topics.door_states, on_door_states)
        await asyncio.wait_for(done, 1)

    async def test_building_map(self):
        '''
        test building map image is saved to static files and data is replaced
        with the url.
        '''
        client = await self.make_client(topics.building_map)
        done = asyncio.Future()

        def on_building_map(building_map: dict):
            image = building_map['levels'][0]['images'][0]
            image_data = image['data']
            self.assertEqual(
                image_data, '/static/test_name/L1-test_image.thbyxgrllndgeciymb3a47hf2re5p7no.png')
            self.assertTrue(os.path.exists(
                f'{self.static_files_dir}/test_name/L1-test_image.thbyxgrllndgeciymb3a47hf2re5p7no.png'))
            done.set_result(True)
        client.on(topics.building_map, on_building_map)

        building_map = make_building_map()
        self.rmf_gateway.building_map.on_next(building_map)
        await asyncio.wait_for(done, 5)