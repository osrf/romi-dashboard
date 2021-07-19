# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order

import unittest

from models.tortoise_models.container import Container
from rest_server.test_utils import start_test_database
from starlette.testclient import TestClient
from tortoise import Tortoise

from ..app import get_app

app = get_app()


class TestContainerRoute(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)
        await Container.create(name="test")

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    def test_get_containers(self):
        response = self.client.get("report/raw_logs/containers/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), ["test"])
