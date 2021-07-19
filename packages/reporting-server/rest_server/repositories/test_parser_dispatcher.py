import unittest

# Husky is sorting tortoise in a way that tortoise goes after our custom packages.
# and because of that the lint is failing
import tortoise
from fastapi.testclient import TestClient
from models.tortoise_models import (
    Device,
    DispenserState,
    Door,
    DoorState,
    FleetState,
    HealthStatus,
    IngestorState,
    Lift,
    LiftState,
    TaskSummary,
)
from rest_server.__mocks__ import parsed_data
from rest_server.app import get_app
from rest_server.test_utils import start_test_database

from .parser_dispatcher import log_model_dispatcher

app = get_app()


class TestCaseLogParserDispatcher(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

    async def asyncTearDown(self):
        await tortoise.Tortoise.close_connections()

    async def test_dispenser_state_created(self):
        await log_model_dispatcher(parsed_data.mock_dispenser_state)
        instance = await DispenserState.first()
        self.assertEqual(instance.guid, "coke_dispenser")

    async def test_door_state_created(self):
        await log_model_dispatcher(parsed_data.mock_door_state)
        door = await Door.first()
        status = await DoorState.first()
        self.assertEqual(door.name, "hardware_door")
        self.assertIsNotNone(status)

    async def test_fleet_state_created(self):
        await log_model_dispatcher(parsed_data.mock_fleet_state)
        instance = await FleetState.all().prefetch_related("robot", "fleet")
        self.assertEqual(len(instance), 2)

    async def test_fleet_state_fk_created(self):
        await log_model_dispatcher(parsed_data.mock_fleet_state)
        instance = await FleetState.all().prefetch_related("robot", "fleet")
        self.assertEqual(len(instance), 2)

        self.assertEqual(instance[0].fleet.name, "tinyRobot")
        self.assertEqual(instance[0].robot.name, "tinyRobot1")

        self.assertEqual(instance[1].fleet.name, "tinyRobot")
        self.assertEqual(instance[1].robot.name, "tinyRobot2")

    async def test_task_summary_created(self):
        await log_model_dispatcher(parsed_data.mock_task_summary)
        instance = await TaskSummary.first()
        self.assertEqual(instance.task_id, "Loop0")
        self.assertEqual(instance.status, None)

    async def test_ingestor_state_created(self):
        await log_model_dispatcher(parsed_data.mock_ingestor_state)
        instance = await IngestorState.first()
        self.assertEqual(instance.guid, "coke_ingestor")

    async def test_lift_state_created(self):
        await log_model_dispatcher(parsed_data.mock_lift_state)
        lift = await Lift.first()
        self.assertIsNotNone(lift.name, "test_lift")
        instance = await LiftState.first()
        self.assertIsNotNone(instance)
        self.assertEqual(instance.current_floor, "L1")


class TestCaseHealthParserDispatcher(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await start_test_database()
        self.client = TestClient(app)

    async def asyncTearDown(self):
        await tortoise.Tortoise.close_connections()

    async def test_door_health_created(self):
        data = 'door_health:{"id": "hardware_door", "health_status": "HealthStatus.HEALTHY", "health_message": null}\n'
        await log_model_dispatcher(data)
        instance = await Device.first()
        self.assertEqual(instance.actor, "hardware_door")
        self.assertEqual(instance.type, "door_health")

        health_instance = await HealthStatus.first()
        self.assertIsNotNone(health_instance)

    async def test_robot_health_created(self):
        data = 'robot_health:{"id": "robot1", "health_status": "HealthStatus.HEALTHY", "health_message": null}\n'
        await log_model_dispatcher(data)
        instance = await Device.first()
        self.assertEqual(instance.actor, "robot1")
        self.assertEqual(instance.type, "robot_health")

        health_instance = await HealthStatus.first()
        self.assertIsNotNone(health_instance)

    async def test_lift_health_created(self):
        data = 'lift_health:{"id": "lift1", "health_status": "HealthStatus.HEALTHY", "health_message": null}\n'
        await log_model_dispatcher(data)
        instance = await Device.first()
        self.assertEqual(instance.actor, "lift1")
        self.assertEqual(instance.type, "lift_health")

        health_instance = await HealthStatus.first()
        self.assertIsNotNone(health_instance)
