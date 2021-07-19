import unittest

from models.tortoise_models.fleet_state import FleetState
from rest_server.__mocks__.parsed_data import mock_fleet_state

from .fleet_state_parser import fleet_state_parser


class TestCaseFleetState(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.data = mock_fleet_state

    async def test_parse_and_get_values(self):
        parsed_values = await fleet_state_parser(self.data)

        self.assertEqual(len(parsed_values), 2)
        first_robot = parsed_values[0]
        second_robot = parsed_values[1]

        self.assertEqual(first_robot["fleet_name"], "tinyRobot")
        self.assertEqual(first_robot["robot_name"], "tinyRobot1")
        self.assertEqual(first_robot["robot_model"], "")
        self.assertEqual(first_robot["robot_task_id"], "")
        self.assertEqual(first_robot["robot_battery_percent"], 100.0)
        self.assertEqual(first_robot["robot_seq"], 3190)
        self.assertEqual(
            first_robot["robot_mode"], FleetState.service.get_robot_state_name(1)
        )

        self.assertEqual(second_robot["fleet_name"], "tinyRobot")
        self.assertEqual(second_robot["robot_name"], "tinyRobot2")
        self.assertEqual(second_robot["robot_model"], "")
        self.assertEqual(second_robot["robot_task_id"], "")
        self.assertEqual(second_robot["robot_battery_percent"], 100.0)
        self.assertEqual(second_robot["robot_seq"], 3191)
        self.assertEqual(
            second_robot["robot_mode"], FleetState.service.get_robot_state_name(1)
        )

    async def test_return_empty_list_if_no_robot(self):
        parsed_values = await fleet_state_parser(
            'fleet_state:{"name": "tinyRobot", "robots":[]}'
        )
        self.assertEqual(parsed_values, [])
