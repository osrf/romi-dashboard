import unittest

from building_map_msgs.msg import Door
from builtin_interfaces.msg import Time as RosTime
from rmf_door_msgs.msg import DoorMode as RmfDoorMode
from tortoise import Tortoise

from ..rmf_io.test_data import make_door, make_door_state
from .sql import SqlRepository


class TestSqlRepository(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await Tortoise.init(
            db_url="sqlite://:memory:", modules={"models": ["api_server.models"]}
        )
        await Tortoise.generate_schemas()
        self.repo = SqlRepository()

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_read_door_states(self):
        door_state = make_door_state("test_door", RmfDoorMode.MODE_CLOSED)
        door_state.door_time = RosTime(sec=0, nanosec=0)
        door_state2 = make_door_state("test_door2", RmfDoorMode.MODE_CLOSED)
        door_state.door_time = RosTime(sec=0, nanosec=0)
        await self.repo.update_door_state(door_state)
        await self.repo.update_door_state(door_state2)

        door_state.door_time.sec = 1
        await self.repo.update_door_state(door_state)
        door_state2.current_mode.value = RmfDoorMode.MODE_OPEN
        door_state2.door_time.sec = 1
        await self.repo.update_door_state(door_state2)

        door_states = await self.repo.read_door_states()
        self.assertEqual(len(door_states), 2)
        self.assertEqual(door_states["test_door"].door_time.sec, 1)
        self.assertEqual(
            door_states["test_door"].current_mode.value, RmfDoorMode.MODE_CLOSED
        )
        self.assertEqual(door_states["test_door2"].door_time.sec, 1)
        self.assertEqual(
            door_states["test_door2"].current_mode.value, RmfDoorMode.MODE_OPEN
        )

    async def test_update_door(self):
        door = make_door("test_door")
        await self.repo.update_door(door)

        result: Door = await self.repo.read_door("test_door")
        self.assertEqual(result.name, "test_door")

    async def test_sync_doors(self):
        door = make_door("test_door")
        await self.repo.sync_doors([door])
        result: Door = await self.repo.read_door("test_door")
        self.assertEqual(result.name, "test_door")

        # doors not in the list should be deleted
        door2 = make_door("test_door2")
        await self.repo.sync_doors([door2])
        result: Door = await self.repo.read_door("test_door2")
        self.assertEqual(result.name, "test_door2")
        result = await self.repo.read_door("test_door")
        self.assertIsNone(result)
