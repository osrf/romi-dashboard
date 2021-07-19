# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.health import Device, HealthStatus, HealthStatusEmun
from rest_server.app import get_app
from rest_server.repositories.report.health import get_health
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportHealth(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        device1 = await Device.create(type="door")
        device2 = await Device.create(type="lift")
        await HealthStatus.create(
            device=device1,
            health_status=HealthStatusEmun.HEALTHY,
        )
        await HealthStatus.create(
            device=device2,
            health_status=HealthStatusEmun.HEALTHY,
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_health_status(self):
        health_list = await get_health(0, 10)
        self.assertEqual(len(health_list), 2)
