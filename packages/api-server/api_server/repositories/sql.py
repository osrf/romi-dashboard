import logging
from typing import Dict, Sequence

import tortoise
from building_map_msgs.msg import Door as RmfDoor
from rmf_door_msgs.msg import DoorState as RmfDoorState

from ..models import Door, DoorHealth, DoorState
from .rmf import RmfRepository


class SqlRepository(RmfRepository):
    """
    NOTE: tortoise-orm must already be inited before using any of the methods in this class.
    """

    def __init__(self, logger: logging.Logger = None):
        self.logger = logger or logging.getLogger(self.__class__.__name__)

    async def _save(self, value: tortoise.Model, **filter_args):
        existing = await value.filter(**filter_args).first()
        if existing:
            await value.save(force_update=True)
        else:
            await value.save(force_create=True)

    async def update_door_state(self, door_state: RmfDoorState):
        sql_door_state = await DoorState.from_rmf(door_state)
        await self._save(sql_door_state, door_name=sql_door_state.door_name)
        self.logger.debug(
            f"written door_state ({sql_door_state.door_name}) to database"
        )

    async def read_door_states(self) -> Dict[str, RmfDoorState]:
        all_states = await DoorState.all()
        return {x.door_name: x.to_rmf() for x in all_states}

    async def update_door(self, door: RmfDoor):
        sql_door = await Door.from_rmf(door)
        await self._save(sql_door, name=sql_door.name)
        self.logger.debug(f"written door ({sql_door.name}) to database")

    async def read_door(self, name: str):
        door = await Door.filter(name=name).first()
        if door:
            return Door.to_rmf(door)
        return None

    async def sync_doors(self, doors: Sequence[RmfDoor]) -> None:
        async with tortoise.transactions.in_transaction():
            await Door.all().delete()
            for door in doors:
                await self.update_door(door)

    async def update_door_health(self, door_health: DoorHealth):
        await self._save(door_health, name=door_health.name)
        self.logger.debug(f'written door health for "{door_health.name}" to database')

    async def read_door_health(self, door_name: str):
        return await DoorHealth.filter(name=door_name).first()
