# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models import RawLog
from models.tortoise_models.auth_events import AuthEvents
from rest_server.__mocks__ import raw_data
from rest_server.app import get_app
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

from .log_creation_handler import RawLogHandler, create_keycloak_log

app = get_app()


class TestCaseRawLogCreationRepository(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)
        self.RawLogHandler = RawLogHandler()

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_no_data_sent_to_rawlog(self):
        response = await RawLogHandler.create_raw_log([])
        self.assertEqual(response, "No valid data")

    async def test_create_a_raw_log_correctly(self):
        data = [
            raw_data.mock_dispenser_state,
            raw_data.mock_door_state,
            "this is a test",
        ]
        response = await RawLogHandler.create_raw_log(data)
        self.assertEqual(response, "Logs were saved correctly")

    async def test_raw_log_handle_creation_of_logs(self):
        data = [
            raw_data.mock_dispenser_state,
            raw_data.mock_door_state,
            "this is a test",
        ]
        await RawLogHandler.create_raw_log(data)
        dispenser = await RawLog.all()
        self.assertEqual(len(dispenser), 3)

    async def test_raw_log_handle_creation_of_logs_with_container_name(self):
        await RawLogHandler.create_raw_log([raw_data.mock_dispenser_state])
        log = await RawLog.first().prefetch_related("container")
        self.assertEqual(log.container.name, "app-that-writes-logs")


class TestCaseKeycloakCreationRepository(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)
        self.RawLogHandler = RawLogHandler()

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_keycloak_log_creation(self):
        await create_keycloak_log(
            [raw_data.mock_keycloak_login_error, raw_data.mock_keycloak_login]
        )
        logs = await AuthEvents.all()
        self.assertEqual(len(logs), 2)

    async def test_keycloak_logout_creation(self):
        await create_keycloak_log([raw_data.mock_keycloak_logout])
        logs = await AuthEvents.all()
        self.assertEqual(len(logs), 1)
