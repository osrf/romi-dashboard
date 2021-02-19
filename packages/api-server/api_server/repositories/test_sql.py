import unittest

from builtin_interfaces.msg import Time as RosTime
from rmf_door_msgs.msg import DoorMode as RmfDoorMode
from rmf_door_msgs.msg import DoorState as RmfDoorState
from tortoise import Tortoise

from .sql import SqlRepository


class TestSqlRepository(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await Tortoise.init(
            db_url="sqlite://:memory:", modules={"models": ["api_server.models"]}
        )
        await Tortoise.generate_schemas()
        self.repo = SqlRepository()

        door_state = RmfDoorState(
            door_name="test_door",
            current_mode=RmfDoorMode(value=RmfDoorMode.MODE_CLOSED),
            door_time=RosTime(sec=0, nanosec=0),
        )
        door_state2 = RmfDoorState(
            door_name="test_door2",
            current_mode=RmfDoorMode(value=RmfDoorMode.MODE_CLOSED),
            door_time=RosTime(sec=0, nanosec=0),
        )
        await self.repo.write_door_state(door_state)
        await self.repo.write_door_state(door_state2)
        door_state.door_time.sec = 1
        await self.repo.write_door_state(door_state)
        door_state2.current_mode.value = RmfDoorMode.MODE_OPEN
        door_state2.door_time.sec = 1
        await self.repo.write_door_state(door_state2)

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_read_door_states(self):
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
