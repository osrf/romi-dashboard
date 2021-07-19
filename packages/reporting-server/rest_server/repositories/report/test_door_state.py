# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.door import Door
from models.tortoise_models.door_state import DoorState, DoorStateEnum
from rest_server.app import get_app
from rest_server.repositories.report.door_state import get_door_state
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportDoorState(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        door = await Door.create(name="Door 1")

        await DoorState.create(door=door, state=DoorStateEnum.CLOSED)
        await DoorState.create(door=door, state=DoorStateEnum.CLOSED)

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_door_states(self):
        door_list = await get_door_state(0, 10)
        self.assertEqual(len(door_list), 2)
