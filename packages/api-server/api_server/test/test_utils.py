from typing import Optional, Sequence

from tortoise import Tortoise


async def init_db(models: Optional[Sequence[str]] = None):
    models = models or ["api_server.models.tortoise_models"]
    await Tortoise.init(
        db_url="sqlite://:memory:",
        modules={"models": models},
    )
    await Tortoise.generate_schemas()
