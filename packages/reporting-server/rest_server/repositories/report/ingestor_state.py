from typing import Optional

from models.pydantic_models import IngestorState_Pydantic
from models.tortoise_models.ingestor_state import IngestorState
from rest_server.repositories.report.utils import get_date_range_query


async def get_ingestor_state(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    query = get_date_range_query(to_log_date, from_log_date)

    return await IngestorState_Pydantic.from_queryset(
        IngestorState.filter(**query).offset(offset).limit(limit).order_by("-created")
    )
