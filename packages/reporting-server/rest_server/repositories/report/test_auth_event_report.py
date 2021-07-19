# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.auth_events import AuthEvents
from rest_server.app import get_app
from rest_server.repositories.report.auth_event_report import (
    get_auth_events,
    get_user_login_failure_report,
    get_user_login_report,
    get_user_logout_report,
)
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportAuthEventServerLogRoute(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        await AuthEvents.create(
            username="test_user",
            user_keycloak_id="test_id",
            event_type="LOGIN_ERROR",
            realm_id="test",
            client_id="test",
        )

        await AuthEvents.create(
            username="test_user",
            user_keycloak_id="test_id",
            event_type="LOGIN",
            realm_id="test",
            client_id="test",
        )

        await AuthEvents.create(
            username="test_user",
            user_keycloak_id="test_id",
            event_type="LOGOUT",
            realm_id="test",
            client_id="test",
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_user_login_report(self):
        login_list = await get_user_login_report(0, 10)
        self.assertEqual(len(login_list), 1)

    async def test_get_user_logout_report(self):
        logout_list = await get_user_logout_report(0, 10)
        self.assertEqual(len(logout_list), 1)

    async def test_get_user_login_failure_report(self):
        login_error_list = await get_user_login_failure_report(0, 10)
        self.assertEqual(len(login_error_list), 1)

    async def test_get_auth_events(self):
        login_list = await get_auth_events("LOGIN", 0, 10)
        login_error_list = await get_auth_events("LOGIN_ERROR", 0, 10)
        logout_list = await get_auth_events("LOGOUT", 0, 10)

        self.assertEqual(len(login_error_list), 1)
        self.assertEqual(len(logout_list), 1)
        self.assertEqual(len(login_list), 1)

        self.assertEqual(login_list[0].event_type, "LOGIN")
        self.assertEqual(login_error_list[0].event_type, "LOGIN_ERROR")
        self.assertEqual(logout_list[0].event_type, "LOGOUT")
