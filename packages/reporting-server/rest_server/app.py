# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order

import logging
import os
import sys

from dependencies import auth_scheme, logger
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rest_server.routers import log_router, report_router
from tortoise.contrib.fastapi import register_tortoise

from .app_config import SystemMode, app_config

logger = logging.getLogger("rest_app")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(handler)
if "RMF_REST_SERVER_DEBUG" in os.environ:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)

logger.info("started app")


TORTOISE_ORM = {
    "connections": {"default": app_config.db_url},
    "apps": {
        "models": {
            "models": ["models", "aerich.models"],
            "default_connection": "default",
        },
    },
}


def get_app(run_config=SystemMode.ALL):
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if run_config in (SystemMode.ALL, SystemMode.FLUENTD):
        app.include_router(log_router, prefix="/log", tags=["log"])

    if run_config in (SystemMode.ALL, SystemMode.REPORT):
        app.include_router(
            report_router,
            prefix="/report",
            tags=["report"],
            dependencies=[Depends(auth_scheme)],
        )

    register_tortoise(
        app,
        db_url=app_config.db_url,
        modules={"models": ["models"]},
        generate_schemas=False,
        add_exception_handlers=True,
    )

    return app
