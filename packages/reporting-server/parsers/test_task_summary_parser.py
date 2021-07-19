import unittest

from models.tortoise_models.task_summary import TaskSummary
from rest_server.__mocks__.parsed_data import mock_task_summary

from .task_summary_parser import task_summary_parser


class TestCaseTaskSummary(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.data = mock_task_summary

    async def test_parse_and_get_values(self):
        parsed_values = await task_summary_parser(self.data)

        self.assertEqual(parsed_values["task_id"], "Loop0")
        self.assertEqual(parsed_values["fleet_name"], "tinyRobot")
        self.assertEqual(
            parsed_values["state"], TaskSummary.service.get_task_state_name(0)
        )
        self.assertEqual(parsed_values["status"], None)
        self.assertEqual(
            parsed_values["task_profile"]["submission_time"],
            {"sec": 131, "nanosec": 553000000},
        )
        self.assertEqual(parsed_values["submission_time"], {"sec": 0, "nanosec": 0})
        self.assertEqual(
            parsed_values["start_time"], {"sec": 1623383362, "nanosec": 348338289}
        )
        self.assertEqual(
            parsed_values["end_time"], {"sec": 1623383449, "nanosec": 79154833}
        )
        self.assertEqual(parsed_values["robot_name"], "tinyRobot2")
        self.assertEqual(
            parsed_values["task_profile"]["description"]["task_type"]["type"], 1
        )

    async def test_return_empty_list_if_no_task(self):
        parsed_values = await task_summary_parser("task_summary:{}")
        self.assertEqual(parsed_values, {})
