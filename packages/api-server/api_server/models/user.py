from typing import List

from pydantic import BaseModel

from . import tortoise_models as ttm


class User(BaseModel):
    username: str
    is_admin: bool = False
    roles: List[str] = list()

    @staticmethod
    async def load_from_db(username: str) -> "User":
        """
        Loads an user from db, creates the user if it does not exist.
        NOTE: This should only be called after verifying the username comes from a trusted source (e.g. after verifying the jwt).
        """
        ttm_user, _ = await ttm.User.get_or_create(
            {"is_admin": False}, username=username
        )
        await ttm_user.fetch_related("roles")
        return User(
            username=username,
            is_admin=ttm_user.is_admin,
            roles=[r.name for r in ttm_user.roles],
        )
