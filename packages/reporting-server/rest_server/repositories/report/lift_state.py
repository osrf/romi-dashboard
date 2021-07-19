from typing import Optional

from models.pydantic_models import LiftState_Pydantic
from models.tortoise_models.lift_state import LiftState
from rest_server.repositories.report.utils import get_date_range_query


async def get_lift_state(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):

    query = get_date_range_query(to_log_date, from_log_date)

    queryset = (
        LiftState.filter(**query)
        .prefetch_related("lift")
        .offset(offset)
        .limit(limit)
        .order_by("-created")
    )

    return await LiftState_Pydantic.from_queryset(queryset)
