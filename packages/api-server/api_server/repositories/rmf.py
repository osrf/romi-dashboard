from typing import List, Optional

from tortoise.queryset import QuerySet

from ..models import (
    BuildingMap,
    Dispenser,
    DispenserHealth,
    DispenserState,
    Door,
    DoorHealth,
    DoorState,
    FleetState,
    Ingestor,
    IngestorHealth,
    IngestorState,
    Lift,
    LiftHealth,
    LiftState,
    RobotHealth,
    TaskSummary,
    User,
)
from ..models import tortoise_models as ttm
from ..permissions import Enforcer, RmfAction


class RmfRepository:
    """
    tortoise-orm must be initialized before using any of the methods in this class.
    """

    @staticmethod
    def _build_filter_params(**queries: dict):
        filter_params = {}
        for k, v in queries.items():
            if v is not None:
                filter_params[k] = v
        return filter_params

    async def get_bulding_map(self) -> Optional[BuildingMap]:
        building_map = await ttm.BuildingMap.first()
        if building_map is None:
            return None
        return BuildingMap(**building_map.data)

    async def save_building_map(self, building_map: BuildingMap):
        await ttm.BuildingMap.update_or_create(
            {"data": building_map.dict()},
            id_=building_map.name,
        )

    async def get_doors(self) -> List[Door]:
        building_map = await self.get_bulding_map()
        if building_map is None:
            return []
        return [door for level in building_map.levels for door in level.doors]

    async def get_door_state(self, door_name: str) -> Optional[DoorState]:
        door_state = await ttm.DoorState.get_or_none(id_=door_name)
        if door_state is None:
            return None
        return DoorState(**door_state.data)

    async def query_door_states(self, **queries) -> List[DoorState]:
        return [
            DoorState(**door_state.data)
            for door_state in await ttm.DoorState.filter(**queries)
        ]

    async def save_door_state(self, door_state: DoorState):
        await ttm.DoorState.update_or_create(
            {"data": door_state.dict()},
            id_=door_state.door_name,
        )

    async def get_door_health(self, door_name: str) -> Optional[DoorHealth]:
        return await ttm.DoorHealth.get_or_none(id_=door_name)

    async def query_door_health(self, **queries) -> List[DoorHealth]:
        return await ttm.DoorHealth.filter(**queries)

    async def save_door_health(self, door_health: DoorHealth):
        dic = door_health.dict()
        del dic["id_"]
        await ttm.DoorHealth.update_or_create(dic, id_=door_health.id_)

    async def get_lifts(self) -> List[Lift]:
        building_map = await self.get_bulding_map()
        if building_map is None:
            return []
        return building_map.lifts

    async def get_lift_state(self, lift_name: str) -> Optional[LiftState]:
        lift_state = await ttm.LiftState.get_or_none(id_=lift_name)
        if lift_state is None:
            return None
        return LiftState(**lift_state.data)

    async def query_lift_states(self, **queries) -> List[LiftState]:
        return [
            LiftState(**lift_state.data)
            for lift_state in await ttm.LiftState.filter(**queries)
        ]

    async def save_lift_state(self, lift_state: LiftState):
        await ttm.LiftState.update_or_create(
            {"data": lift_state.dict()},
            id_=lift_state.lift_name,
        )

    async def get_lift_health(self, lift_name: str) -> Optional[LiftHealth]:
        return await ttm.LiftHealth.get_or_none(id_=lift_name)

    async def query_lift_health(self, **queries) -> List[LiftHealth]:
        return await ttm.LiftHealth.filter(**queries)

    async def save_lift_health(self, lift_health: LiftHealth):
        dic = lift_health.dict()
        del dic["id_"]
        await ttm.LiftHealth.update_or_create(dic, id_=lift_health.id_)

    async def query_dispensers(self, **queries) -> List[Dispenser]:
        states = await ttm.DispenserState.filter(**queries)
        return [Dispenser(guid=state.data["guid"]) for state in states]

    async def get_dispenser_state(self, guid: str) -> Optional[DispenserState]:
        dispenser_state = await ttm.DispenserState.get_or_none(id_=guid)
        if dispenser_state is None:
            return None
        return DispenserState(**dispenser_state.data)

    async def query_dispenser_states(self, **queries) -> List[DispenserState]:
        return [
            DispenserState(**dispenser_state.data)
            for dispenser_state in await ttm.DispenserState.filter(**queries)
        ]

    async def save_dispenser_state(self, dispenser_state: DispenserState):
        await ttm.DispenserState.update_or_create(
            {
                "data": dispenser_state.dict(),
            },
            id_=dispenser_state.guid,
        )

    async def get_dispenser_health(self, guid: str) -> Optional[DispenserHealth]:
        return await ttm.DispenserHealth.get_or_none(id_=guid)

    async def query_dispenser_health(self, **queries) -> List[DispenserHealth]:
        return await ttm.DispenserHealth.filter(**queries)

    async def save_dispenser_health(self, dispenser_health: DispenserHealth):
        dic = dispenser_health.dict()
        del dic["id_"]
        await ttm.DispenserHealth.update_or_create(dic, id_=dispenser_health.id_)

    async def query_ingestors(self, **queries) -> List[Ingestor]:
        states = await ttm.IngestorState.filter(**queries)
        return [Ingestor(guid=state.data["guid"]) for state in states]

    async def get_ingestor_state(self, guid: str) -> Optional[IngestorState]:
        ingestor_state = await ttm.IngestorState.get_or_none(id_=guid)
        if ingestor_state is None:
            return None
        return IngestorState(**ingestor_state.data)

    async def query_ingestor_states(self, **queries) -> List[IngestorState]:
        return [
            IngestorState(**ingestor_state.data)
            for ingestor_state in await ttm.IngestorState.filter(**queries)
        ]

    async def save_ingestor_state(self, ingestor_state: IngestorState):
        await ttm.IngestorState.update_or_create(
            {
                "data": ingestor_state.dict(),
            },
            id_=ingestor_state.guid,
        )

    async def get_ingestor_health(self, guid: str) -> Optional[IngestorHealth]:
        return await ttm.IngestorHealth.get_or_none(id_=guid)

    async def query_ingestor_health(self, **queries) -> List[IngestorHealth]:
        return await ttm.IngestorHealth.filter(**queries)

    async def save_ingestor_health(self, ingestor_health: IngestorHealth) -> None:
        dic = ingestor_health.dict()
        del dic["id_"]
        await ttm.IngestorHealth.update_or_create(dic, id_=ingestor_health.id_)

    async def get_fleet_state(self, fleet_name: str) -> Optional[FleetState]:
        fleet_state = await ttm.FleetState.get_or_none(id_=fleet_name)
        if fleet_state is None:
            return None
        return FleetState(**fleet_state.data)

    async def query_fleet_states(self, **queries) -> List[FleetState]:
        return [
            FleetState(**fleet_state.data)
            for fleet_state in await ttm.FleetState.filter(**queries)
        ]

    async def save_fleet_state(self, fleet_state: FleetState) -> None:
        await ttm.FleetState.update_or_create(
            {"data": fleet_state.dict()},
            id_=fleet_state.name,
        )

    async def get_robot_health(
        self, fleet_name: str, robot_name: str
    ) -> Optional[RobotHealth]:
        return await ttm.RobotHealth.get_or_none(id_=f"{fleet_name}/{robot_name}")

    async def query_robot_health(self, **queries) -> List[RobotHealth]:
        return await ttm.DoorHealth.filter(**queries)

    async def save_robot_health(self, robot_health: RobotHealth) -> None:
        dic = robot_health.dict()
        del dic["id_"]
        await ttm.RobotHealth.update_or_create(dic, id_=robot_health.id_)

    async def get_task_summary(self, task_id: str) -> TaskSummary:
        task_summary = await ttm.TaskSummary.get_or_none(id_=task_id).values("data")
        if not task_summary:
            return None
        return TaskSummary(**task_summary[0]["data"])

    @staticmethod
    def query_tasks(user: User) -> QuerySet[ttm.TaskSummary]:
        return Enforcer.query(user, ttm.TaskSummary, RmfAction.TaskRead)
