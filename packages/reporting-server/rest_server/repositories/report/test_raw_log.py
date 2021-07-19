# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from rest_server.app import get_app
from rest_server.repositories.log_creation_handler import RawLogHandler
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

from .raw_log import get_containers

app = get_app()


class TestRmfServerLogRoute(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_raw_log_handle_creation_of_logs_with_container_name(self):
        data = [
            {
                "log": 'INFO:app.BookKeeper.dispenser_state:{"time": {"sec": 1600, "nanosec": 0}, "guid": "coke_dispenser", "mode": 0, "request_guid_queue": [], "seconds_remaining": 0.0}\n',
                "stream": "stdout",
                "kubernetes": {"container_name": "container1"},
            },
            {
                "log": 'INFO:app.BookKeeper.dispenser_state:{"time": {"sec": 1600, "nanosec": 0}, "guid": "coke_dispenser", "mode": 0, "request_guid_queue": [], "seconds_remaining": 0.0}\n',
                "stream": "stdout",
                "kubernetes": {"container_name": "container2"},
            },
            {
                "log": 'INFO:app.BookKeeper.dispenser_state:{"time": {"sec": 1600, "nanosec": 0}, "guid": "coke_dispenser", "mode": 0, "request_guid_queue": [], "seconds_remaining": 0.0}\n',
                "stream": "stdout",
                "kubernetes": {"container_name": "container2"},
            },
        ]

        await RawLogHandler.create_raw_log(data)
        containers = await get_containers()
        self.assertEqual(len(containers), 2)
