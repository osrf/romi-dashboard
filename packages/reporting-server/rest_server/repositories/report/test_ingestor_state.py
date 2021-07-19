# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.ingestor_state import IngestorState, IngestorStateEnum
from rest_server.app import get_app
from rest_server.repositories.report.ingestor_state import get_ingestor_state
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportIngestorState(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        await IngestorState.create(
            guid="guid1",
            state=IngestorStateEnum.IDLE,
        )

        await IngestorState.create(
            guid="guid2",
            state=IngestorStateEnum.IDLE,
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_ingestor_states(self):
        ingestor_list = await get_ingestor_state(0, 10)
        self.assertEqual(len(ingestor_list), 2)
