# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.dispenser_state import DispenserState, DispenserStateEnum
from rest_server.app import get_app
from rest_server.repositories.report.dispenser_state import get_dispenser_state
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportDispenserState(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        await DispenserState.create(
            guid="guid1",
            state=DispenserStateEnum.IDLE,
        )

        await DispenserState.create(
            guid="guid2",
            state=DispenserStateEnum.IDLE,
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_dispenser_states(self):
        dispenser_list = await get_dispenser_state(0, 10)
        self.assertEqual(len(dispenser_list), 2)
