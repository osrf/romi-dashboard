from typing import Any, List, Optional

from fastapi import APIRouter
from models.pydantic_models import (
    AuthEvents_Pydantic,
    DispenserState_Pydantic,
    DoorState_Pydantic,
    FleetState_Pydantic,
    HealthStatus_Pydantic,
    IngestorState_Pydantic,
    LiftState_Pydantic,
    TaskSummary_Pydantic,
)
from rest_server.repositories.report import (
    get_all_raw_logs,
    get_containers,
    get_dispenser_state,
    get_door_state,
    get_fleet_state,
    get_health,
    get_ingestor_state,
    get_lift_state,
    get_task_summary,
)
from rest_server.repositories.report.auth_event_report import (
    get_user_login_failure_report,
    get_user_login_report,
    get_user_logout_report,
)

router = APIRouter()

LIMIT = 500


@router.get("/raw_logs/", tags=["raw_logs"], response_model=List[Any])
async def raw_logs_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    logLevel: Optional[str] = None,
    containerLabel: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_all_raw_logs(
        offset, limit, toLogDate, fromLogDate, logLevel, containerLabel
    )


@router.get("/raw_logs/containers", tags=["raw_logs_get_containers"])
async def raw_logs_get_containers():
    return await get_containers()


@router.get(
    "/door_state/", tags=["door_state"], response_model=List[DoorState_Pydantic]
)
async def door_state_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_door_state(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/fleet_state/", tags=["fleet_state"], response_model=List[FleetState_Pydantic]
)
async def fleet_state_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_fleet_state(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/dispenser_state/",
    tags=["dispenser_state"],
    response_model=List[DispenserState_Pydantic],
)
async def dispenser_state_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_dispenser_state(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/ingestor_state/",
    tags=["ingestor_state"],
    response_model=List[IngestorState_Pydantic],
)
async def ingestor_state_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_ingestor_state(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/lift_state/", tags=["lift_state"], response_model=List[LiftState_Pydantic]
)
async def lift_state_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_lift_state(offset, limit, toLogDate, fromLogDate)


@router.get("/health/", tags=["health"], response_model=List[HealthStatus_Pydantic])
async def health_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_health(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/task_summary/", tags=["task_summary"], response_model=List[TaskSummary_Pydantic]
)
async def task_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_task_summary(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/user/login/", tags=["user_login"], response_model=List[AuthEvents_Pydantic]
)
async def user_login_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_user_login_report(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/user/logout/", tags=["user_logout"], response_model=List[AuthEvents_Pydantic]
)
async def user_logout_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_user_logout_report(offset, limit, toLogDate, fromLogDate)


@router.get(
    "/user/loginfailure/",
    tags=["user_login_failure"],
    response_model=List[AuthEvents_Pydantic],
)
async def user_login_failure_report(
    toLogDate: Optional[str] = None,
    fromLogDate: Optional[str] = None,
    offset: Optional[int] = 0,
    limit: Optional[int] = LIMIT,
):

    return await get_user_login_failure_report(offset, limit, toLogDate, fromLogDate)
