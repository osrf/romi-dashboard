from typing import Callable, List

from fastapi import APIRouter, Depends

from ..models import Permission, User
from ..models import tortoise_models as ttm


def main_router(user_dep: Callable[..., User]):
    router = APIRouter()

    @router.get("/user", response_model=User)
    async def get_user(user: User = Depends(user_dep)):
        """
        Get the currently logged in user
        """
        return user

    @router.get("/permissions", response_model=List[Permission])
    async def get_effective_permissions(user: User = Depends(user_dep)):
        """
        Get the effective permissions of the current user
        """
        perms = (
            await ttm.ResourcePermission.filter(role__name__in=user.roles)
            .distinct()
            .values("authz_grp", "action")
        )
        return [
            Permission.construct(authz_grp=p["authz_grp"], action=p["action"])
            for p in perms
        ]

    return router
