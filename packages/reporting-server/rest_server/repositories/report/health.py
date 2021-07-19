from typing import Optional

from models.pydantic_models import HealthStatus_Pydantic
from models.tortoise_models.health import HealthStatus
from rest_server.repositories.report.utils import get_date_range_query


async def get_health(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    query = get_date_range_query(to_log_date, from_log_date)

    queryset = (
        HealthStatus.filter(**query)
        .prefetch_related("device")
        .offset(offset)
        .limit(limit)
        .order_by("-created")
    )

    return await HealthStatus_Pydantic.from_queryset(queryset)
