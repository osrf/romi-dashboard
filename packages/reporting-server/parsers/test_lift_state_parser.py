import unittest

from models.tortoise_models.lift_state import LiftState
from rest_server.__mocks__.parsed_data import mock_lift_state

from .lift_state_parser import lift_state_parser


class TestCaseLiftState(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.data = mock_lift_state
        self.data_with_dict_states = 'lift_state: {"lift_name": "test_lift", "lift_time": 0, "available_floors": ["L1", "L2"], "current_floor": "L1", "destination_floor": "L2", "door_state": {"value": 0}, "motion_state": {"value": 0}, "available_modes": [0], "current_mode": {"value": 0}, "session_id": "test_session"}\n'

    async def test_parse_and_get_values(self):
        parsed_values = await lift_state_parser(self.data)
        self.assertEqual(parsed_values["state"], LiftState.service.get_state_name(0))
        self.assertEqual(
            parsed_values["motion_state"], LiftState.service.get_motion_state_name(0)
        )
        self.assertEqual(
            parsed_values["door_state"], LiftState.service.get_door_state_name(0)
        )

        self.assertEqual(parsed_values["current_floor"], "L1")
        self.assertEqual(parsed_values["destination_floor"], "L2")
        self.assertEqual(parsed_values["session_id"], "test_session")

        self.assertEqual(parsed_values["state"], LiftState.service.get_state_name(0))

    async def test_parse_and_get_values_with_dict_states(self):
        parsed_values = await lift_state_parser(self.data_with_dict_states)
        self.assertEqual(parsed_values["state"], LiftState.service.get_state_name(0))
        self.assertEqual(
            parsed_values["motion_state"], LiftState.service.get_motion_state_name(0)
        )
        self.assertEqual(
            parsed_values["door_state"], LiftState.service.get_door_state_name(0)
        )
