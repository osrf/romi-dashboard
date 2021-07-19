# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models import DispenserState, Door, DoorState
from rest_server.__mocks__ import raw_data
from rest_server.app import get_app
from rest_server.repositories.rmf_log_creation_handler import create_rmf_server_log
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestCaseLogRMFServerCreationRepository(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_no_data_sent_to_rmfserver(self):
        response = await create_rmf_server_log([])
        self.assertEqual(response, "No data received")

    async def test_create_a_rmfserver_log_correctly(self):
        data = [raw_data.mock_dispenser_state, raw_data.mock_door_state]
        response = await create_rmf_server_log(data)
        self.assertEqual(response, "Logs were saved correctly")

    async def test_rmfserver_handle_and_return_error(self):
        data = [
            {
                "log2": 'INFO:app.BookKeeper.dispenser_state:{"time": {"sec": 1600, "nanosec": 0}, "guid": "coke_dispenser", "mode": 0, "request_guid_queue": [], "seconds_remaining": 0.0}\n',
                "stream": "stdout",
            },
            raw_data.mock_door_state,
        ]

        response = await create_rmf_server_log(data)
        self.assertEqual(len(response), 1)

    async def test_rmfserver_handle_creation_of_logs(self):
        await create_rmf_server_log(
            [raw_data.mock_dispenser_state, raw_data.mock_door_state]
        )
        dispenser_state = await DispenserState.first()
        door_state = await DoorState.first()
        door = await Door.first()
        self.assertEqual(dispenser_state.guid, "coke_dispenser")
        self.assertEqual(door.name, "hardware_door")
        self.assertIsNotNone(door_state)
