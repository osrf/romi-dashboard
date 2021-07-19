# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order
import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.fleet import Fleet, Robot
from models.tortoise_models.fleet_state import FleetState, RobotStateEnum
from rest_server.app import get_app
from rest_server.repositories.report.fleet_state import get_fleet_state
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportFleetState(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        robot = await Robot.create(name="Robot 1")
        fleet = await Fleet.create(name="Fleet 1")

        await FleetState.create(
            fleet=fleet,
            robot=robot,
            robot_battery_percent="100",
            robot_location="1",
            robot_mode=RobotStateEnum.MODE_WAITING,
            robot_seq=1,
            robot_task_id="test",
        )
        await FleetState.create(
            fleet=fleet,
            robot=robot,
            robot_battery_percent="100",
            robot_location="1",
            robot_mode=RobotStateEnum.MODE_WAITING,
            robot_seq=2,
            robot_task_id="test",
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_fleet_states(self):
        fleet_list = await get_fleet_state(0, 10)
        self.assertEqual(len(fleet_list), 2)
