import logging
from typing import Sequence

from rmf_door_msgs.msg import DoorState as RmfDoorState

from ..models import DoorState


class SqlRepository:
    """
    NOTE: tortoise-orm must already be inited before using any of the methods in this class.
    """

    def __init__(self, logger: logging.Logger = None):
        self.logger = logger or logging.getLogger(self.__class__.__name__)

    async def write_door_state(self, rmf_door_state: RmfDoorState):
        door_state = DoorState.from_rmf(rmf_door_state)
        await door_state.save()
        self.logger.debug(f'written door_state ("{door_state.door_name}") to database')

    async def read_door_states(self) -> Sequence[RmfDoorState]:
        # FIXME: This is probably inefficient but I don't know how to write a good filter.
        latest_states = []
        doors = await DoorState.all().distinct().values("door_name")
        for door in doors:
            state = (
                await DoorState.filter(door_name=door["door_name"])
                .order_by("-door_time")
                .first()
            )
            latest_states.append(state)
        return {x.door_name: x.to_rmf() for x in latest_states}
