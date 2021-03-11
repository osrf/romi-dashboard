import unittest

from rx.scheduler.historicalscheduler import HistoricalScheduler

from ..models import HealthStatus
from .gateway import RmfGateway
from .health_watchdog import HealthWatchdog
from .test_data import make_door_state


class TestHealthWatchdog_DoorHealth(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.scheduler = HistoricalScheduler()
        self.rmf = RmfGateway()
        self.health_watchdog = HealthWatchdog(self.rmf, scheduler=self.scheduler)

    async def test_heartbeat(self):
        health = None

        def assign(v):
            nonlocal health
            health = v

        self.rmf.door_health.pipe().subscribe(assign)

        self.rmf.door_states.on_next(make_door_state("test_door"))
        self.scheduler.advance_by(0)
        self.assertEqual(health.health_status, HealthStatus.HEALTHY)
        self.assertEqual(health.name, "test_door")

        # it should not be dead yet
        self.scheduler.advance_by(HealthWatchdog.LIVELINESS / 2)
        self.assertEqual(health.health_status, HealthStatus.HEALTHY)
        self.assertEqual(health.name, "test_door")

        # it should be dead now because the time between states has reached the threshold
        self.scheduler.advance_by(HealthWatchdog.LIVELINESS / 2)
        self.assertEqual(health.health_status, HealthStatus.DEAD)
        self.assertEqual(health.name, "test_door")

        # it should become alive again when a new state is emitted
        self.rmf.door_states.on_next(make_door_state("test_door"))
        self.assertEqual(health.health_status, HealthStatus.HEALTHY)
        self.assertEqual(health.name, "test_door")
