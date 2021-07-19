# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order

import unittest

from fastapi.testclient import TestClient
from models.tortoise_models.lift import Lift
from models.tortoise_models.lift_state import (
    LiftDoorStateEmun,
    LiftMotionStateEnum,
    LiftState,
    LiftStateEnum,
)
from rest_server.app import get_app
from rest_server.repositories.report.lift_state import get_lift_state
from rest_server.test_utils import start_test_database
from tortoise import Tortoise

app = get_app()


class TestReportHealth(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

        lift1 = await Lift.create(name="1")
        lift2 = await Lift.create(name="2")

        await LiftState.create(
            lift=lift1,
            door_state=LiftDoorStateEmun.DOOR_CLOSED,
            state=LiftStateEnum.MODE_UNKNOWN,
            destination_floor="L2",
            motion_state=LiftMotionStateEnum.MOTION_STOPPED,
            current_floor="L1",
            session_id="123",
        )

        await LiftState.create(
            lift=lift2,
            door_state=LiftDoorStateEmun.DOOR_CLOSED,
            state=LiftStateEnum.MODE_UNKNOWN,
            destination_floor="L3",
            motion_state=LiftMotionStateEnum.MOTION_STOPPED,
            current_floor="L2",
            session_id="123",
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_get_lift_state(self):
        lift_list = await get_lift_state(0, 10)
        self.assertEqual(len(lift_list), 2)
