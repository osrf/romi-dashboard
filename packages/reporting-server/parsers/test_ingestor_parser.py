import unittest

from models.tortoise_models.ingestor_state import IngestorState
from rest_server.__mocks__.parsed_data import mock_ingestor_state

from .ingestor_state_parser import ingestor_state_parser


class TestCaseIngestorState(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.data = mock_ingestor_state

    async def test_parse_and_get_values(self):
        parsed_values = await ingestor_state_parser(self.data)
        self.assertEqual(parsed_values["guid"], "coke_ingestor")
        self.assertEqual(
            parsed_values["state"], IngestorState.service.get_state_name(0)
        )
