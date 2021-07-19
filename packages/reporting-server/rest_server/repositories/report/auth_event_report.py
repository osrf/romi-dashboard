from datetime import timezone
from typing import Optional

from dateutil import parser
from models.pydantic_models import AuthEvents_Pydantic
from models.tortoise_models.auth_events import AuthEvents


async def get_user_login_report(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    return await get_auth_events("LOGIN", offset, limit, to_log_date, from_log_date)


async def get_user_logout_report(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    return await get_auth_events("LOGOUT", offset, limit, to_log_date, from_log_date)


async def get_user_login_failure_report(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    return await get_auth_events(
        "LOGIN_ERROR", offset, limit, to_log_date, from_log_date
    )


async def get_auth_events(
    event_type: str,
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    query = {}
    query["event_type"] = event_type
    if from_log_date:
        local_time = parser.parse(from_log_date)
        utc_time = local_time.astimezone(timezone.utc)
        query["created__gte"] = utc_time

    if to_log_date:
        to_log_local_time = parser.parse(to_log_date)
        to_log_utc_time = to_log_local_time.astimezone(timezone.utc)
        query["created__lt"] = to_log_utc_time

    return await AuthEvents_Pydantic.from_queryset(
        AuthEvents.filter(**query).offset(offset).limit(limit).order_by("-created")
    )
