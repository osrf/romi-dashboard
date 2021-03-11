import json
import logging
from typing import Optional

from rx.operators import flat_map, group_by
from rx.operators import map as rx_map
from rx.scheduler.scheduler import Scheduler

from ..models import DoorHealth, HealthStatus
from .gateway import RmfGateway
from .operators import heartbeat


class HealthWatchdog:
    LIVELINESS = 10

    def __init__(
        self,
        rmf_gateway: RmfGateway,
        *,
        scheduler: Optional[Scheduler] = None,
        logger: logging.Logger = None,
    ):
        self.rmf = rmf_gateway
        self.scheduler = scheduler
        self.logger = logger or logging.getLogger(self.__class__.__name__)

        self._watch_door_health()

    def _watch_door_health(self):
        def map_door_health(has_heartbeat: bool, door_name: str) -> DoorHealth:
            if has_heartbeat:
                return DoorHealth(name=door_name, health_status=HealthStatus.HEALTHY)
            return DoorHealth(
                name=door_name,
                health_status=HealthStatus.DEAD,
                health_message="heartbeat failed",
            )

        def report_door_health(health: DoorHealth):
            message = json.dumps(
                {
                    "name": health.name,
                    "health_status": str(health.health_status),
                    "health_message": health.health_message,
                }
            )
            if health.health_status == HealthStatus.UNHEALTHY:
                self.logger.warning(message)
            elif health.health_status == HealthStatus.DEAD:
                self.logger.error(message)
            else:
                self.logger.info(message)
            self.rmf.door_health.on_next(health)

        self.rmf.door_states.pipe(
            group_by(lambda x: x.door_name),
            flat_map(
                lambda x: x.pipe(
                    heartbeat(self.LIVELINESS),
                    rx_map(lambda y: map_door_health(y, x.key)),
                )
            ),
        ).subscribe(report_door_health, scheduler=self.scheduler)
