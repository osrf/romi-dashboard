# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order


import logging
import os
import sys
from datetime import datetime, timedelta

from dependencies import logger
from models.tortoise_models import (
    AuthEvents,
    DispenserState,
    DoorState,
    FleetState,
    HealthStatus,
    IngestorState,
    LiftState,
    RawLog,
    TaskSummary,
)
from tortoise import Tortoise, run_async

from .app_config import app_config

logger = logging.getLogger("clean_script")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(handler)
if "RMF_REST_SERVER_DEBUG" in os.environ:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

logger.info("started clean up")

reportingModels = [
    AuthEvents,
    DispenserState,
    DoorState,
    FleetState,
    HealthStatus,
    IngestorState,
    LiftState,
    RawLog,
    TaskSummary,
]

number_of_days_to_keep_logs = app_config.log_storage_time + 60

logger.info(
    "You are about to delete all the logs older than %s days",
    str(app_config.log_storage_time),
)


async def delete_logs():

    for model in reportingModels:
        rows = await model.filter(
            created__lt=datetime.now() - timedelta(days=number_of_days_to_keep_logs)
        )

        logger.info("%s has %s rows > 7 days", str(model.__module__), str(len(rows)))

        await model.filter(
            created__lt=datetime.now() - timedelta(days=number_of_days_to_keep_logs)
        ).delete()


async def run():
    await Tortoise.init(
        db_url=app_config.db_url,
        modules={"models": ["models.tortoise_models"]},
    )
    await Tortoise.generate_schemas()
    await delete_logs()


def main():
    run_async(run())


if __name__ == "__main__":
    main()
