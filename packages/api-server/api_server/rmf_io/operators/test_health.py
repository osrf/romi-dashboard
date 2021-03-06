import unittest

import rx
from rx import operators as ops
from rx.scheduler.historicalscheduler import HistoricalScheduler

from ...models import BasicHealth, HealthStatus
from . import most_critical


class TestMostCritical(unittest.TestCase):
    def test_returns_dead_over_unhealthy(self):
        healths = [
            BasicHealth(
                id_="test",
                health_status=HealthStatus.DEAD,
            ),
            BasicHealth(
                id_="test",
                health_status=HealthStatus.UNHEALTHY,
            ),
        ]
        obs_a = rx.of(healths[0]).pipe(ops.timestamp(scheduler=HistoricalScheduler(1)))
        obs_b = rx.of(healths[1]).pipe(ops.timestamp(scheduler=HistoricalScheduler(2)))

        result: BasicHealth = None

        def assign(v):
            nonlocal result
            result = v

        obs_a.pipe(ops.combine_latest(obs_b), most_critical()).subscribe(assign)
        self.assertEqual(result.health_status, HealthStatus.DEAD)

    def test_return_most_recent(self):
        healths = [
            BasicHealth(
                id_="test",
                health_status=HealthStatus.DEAD,
                health_message="first",
            ),
            BasicHealth(
                id_="test",
                health_status=HealthStatus.DEAD,
                health_message="second",
            ),
        ]
        obs_a = rx.of(healths[0]).pipe(ops.timestamp(scheduler=HistoricalScheduler(1)))
        obs_b = rx.of(healths[1]).pipe(ops.timestamp(scheduler=HistoricalScheduler(2)))

        result: BasicHealth = None

        def assign(v):
            nonlocal result
            result = v

        obs_a.pipe(ops.combine_latest(obs_b), most_critical()).subscribe(assign)
        self.assertEqual(result.health_status, HealthStatus.DEAD)
        self.assertEqual(result.health_message, "second")

    def test_ignore_none_values(self):
        healths = [
            BasicHealth(
                id_="test",
                health_status=HealthStatus.HEALTHY,
            ),
            None,
        ]
        obs_a = rx.of(healths[0]).pipe(ops.timestamp(scheduler=HistoricalScheduler(1)))
        obs_b = rx.of(healths[1]).pipe(ops.timestamp(scheduler=HistoricalScheduler(2)))

        result: BasicHealth = None

        def assign(v):
            nonlocal result
            result = v

        obs_a.pipe(ops.combine_latest(obs_b), most_critical()).subscribe(assign)
        self.assertEqual(result.health_status, HealthStatus.HEALTHY)
