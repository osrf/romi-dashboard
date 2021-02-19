from typing import Optional

from tortoise.contrib.pydantic import pydantic_model_creator


def with_pydantic(Model: "tortoise.Model"):
    class WithPydantic(Model):
        _pydantic_model = pydantic_model_creator(Model)

        async def to_pydantic(self):
            return await self._pydantic_model.from_tortoise_orm(self)

        async def to_json(self, indent: Optional[int] = None):
            return (await self.to_pydantic()).json(indent)

    return WithPydantic
