import unittest

from models.tortoise_models.health import HealthStatusEmun

from .health_parser import health_status_parser


class TestCaseHealth(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.data = 'door_health:{"id": "hardware_door", "health_status": "HealthStatus.HEALTHY", "health_message": null}\n'

    async def test_parse_and_get_values(self):
        parsed_values = await health_status_parser(self.data, "door_health")
        self.assertEqual(parsed_values["device"], "door_health")
        self.assertEqual(parsed_values["actor_id"], "hardware_door")
        self.assertEqual(parsed_values["health_status"], HealthStatusEmun.HEALTHY)
        self.assertEqual(parsed_values["health_message"], None)
