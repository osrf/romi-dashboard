from fastapi import FastAPI
from tortoise import Tortoise
from tortoise.contrib.fastapi import register_tortoise

from .app_config import app_config


def setup_database(app: FastAPI, generate_schemas):
    register_tortoise(
        app,
        db_url=app_config.db_url,
        modules={"models": ["models.tortoise_models"]},
        generate_schemas=generate_schemas,
        add_exception_handlers=True,
    )


Tortoise.init_models(["models.tortoise_models"], "models")
