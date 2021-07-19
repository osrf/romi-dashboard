from datetime import timezone
from typing import Optional

from dateutil import parser


def get_date_range_query(
    to_log_date: Optional[str] = None, from_log_date: Optional[str] = None
):

    query = {}

    if from_log_date:
        local_time = parser.parse(from_log_date)
        utc_time = local_time.astimezone(timezone.utc)
        query["created__gte"] = utc_time

    if to_log_date:
        to_log_local_time = parser.parse(to_log_date)
        to_log_utc_time = to_log_local_time.astimezone(timezone.utc)
        query["created__lt"] = to_log_utc_time

    return query
