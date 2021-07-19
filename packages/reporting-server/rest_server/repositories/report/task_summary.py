from typing import Optional

from models.pydantic_models import TaskSummary_Pydantic
from models.tortoise_models.task_summary import TaskSummary
from rest_server.repositories.report.utils import get_date_range_query


async def get_task_summary(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    query = get_date_range_query(to_log_date, from_log_date)

    queryset = (
        TaskSummary.filter(**query)
        .prefetch_related("fleet")
        .prefetch_related("robot")
        .offset(offset)
        .limit(limit)
        .order_by("-created")
    )

    return await TaskSummary_Pydantic.from_queryset(queryset)
