from typing import Optional

from models.pydantic_models import DoorState_Pydantic
from models.tortoise_models.door_state import DoorState
from rest_server.repositories.report.utils import get_date_range_query


async def get_door_state(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):

    query = get_date_range_query(to_log_date, from_log_date)

    queryset = (
        DoorState.filter(**query)
        .prefetch_related("door")
        .offset(offset)
        .limit(limit)
        .order_by("-created")
    )

    return await DoorState_Pydantic.from_queryset(queryset)
