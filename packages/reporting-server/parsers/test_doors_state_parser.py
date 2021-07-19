import unittest

from models.tortoise_models.door_state import DoorState
from rest_server.__mocks__.parsed_data import mock_door_state

from .doors_state_parser import doors_state_parser


class TestCaseDoorsState(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.data = mock_door_state

    async def test_parse_and_get_values(self):
        parsed_values = await doors_state_parser(self.data)
        self.assertEqual(parsed_values["state"], DoorState.service.get_state_name(0))
        self.assertEqual(parsed_values["name"], "hardware_door")
