from typing import Callable, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from tortoise.transactions import in_transaction

from ..dependencies import AddPaginationQuery, pagination_query
from ..models import User
from ..models import tortoise_models as ttm


class PostUsers(BaseModel):
    username: str
    is_admin: bool = False


class PostRoles(BaseModel):
    name: str


class PostRolePermissions(BaseModel):
    action: str
    authz_grp: Optional[str] = ""


class GetRolePermission(BaseModel):
    authz_grp: Optional[str] = ""
    role: str
    action: str


async def _get_db_role(role_name: str) -> ttm.Role:
    db_role = await ttm.Role.get_or_none(name=role_name)
    if db_role is None:
        raise HTTPException(404)
    return db_role


async def _get_db_user(username: str) -> ttm.User:
    user = await ttm.User.get_or_none(username=username)
    if user is None:
        raise HTTPException(404)
    return user


def admin_router(user_dep: Callable[..., User]):
    def admin_dep(user: User = Depends(user_dep)):
        if not user.is_admin:
            raise HTTPException(403)

    router = APIRouter(tags=["Admin"], dependencies=[Depends(admin_dep)])

    @router.get("/users", response_model=List[str])
    async def get_users(
        add_pagination: AddPaginationQuery[ttm.User] = Depends(pagination_query()),
        username: Optional[str] = Query(
            None, description="filters username that starts with the value"
        ),
        is_admin: Optional[bool] = Query(None),
    ):
        """
        Search users
        """
        filter_params = {}
        if username is not None:
            filter_params["username__istartswith"] = username
        if is_admin is not None:
            filter_params["is_admin"] = is_admin
        q = add_pagination(ttm.User.filter(**filter_params)).values_list(
            "username", flat=True
        )
        return await q

    @router.post("/users")
    async def create_user(body: PostUsers):
        """
        Create a user
        """
        await ttm.User.create(username=body.username, is_admin=body.is_admin)

    @router.get("/users/{username}", response_model=User)
    async def get_user(username: str):
        """
        Get an user
        """
        # checks if the user exist in the database
        await _get_db_user(username)
        return await User.load_from_db(username)

    @router.delete("/users/{username}")
    async def delete_user(username: str):
        """
        Delete an user

        This only performs a soft delete, while the user is deleted from the app database,
        it still exists in the idp so they can still log in, the user will then be re-created
        with the default permissions.
        """
        user = await _get_db_user(username)
        await user.delete()

    @router.post("/users/{username}/roles")
    async def add_user_role(username: str, body: PostRoles):
        """
        Add role to an user
        """
        user = await _get_db_user(username)
        await user.fetch_related("roles")
        role = await _get_db_role(body.name)
        await user.roles.add(role)

    @router.delete("/users/{username}/roles")
    async def delete_user_role(username: str, body: PostRoles):
        """
        Remove role from an user
        """
        user = await _get_db_user(username)
        await user.fetch_related("roles")
        role = await _get_db_role(body.name)
        await user.roles.remove(role)

    @router.put("/users/{username}/roles")
    async def set_user_roles(username: str, body: List[PostRoles]):
        """
        Set the roles of an user
        """
        user = await _get_db_user(username)
        async with in_transaction():
            role_names = [r.name for r in body]
            roles = await ttm.Role.filter(name__in=role_names)
            if len(roles) != len(role_names):
                raise HTTPException(422, "one or more roles does not exist")
            await user.roles.clear()
            await user.roles.add(*roles)

    @router.get("/roles", response_model=List[str])
    async def get_roles():
        """
        Get all roles
        """
        return await ttm.Role.all().values_list("name", flat=True)

    @router.post("/roles")
    async def create_role(body: PostRoles):
        """
        Create a new role
        """
        await ttm.Role.create(name=body.name)

    @router.delete("/roles/{role}")
    async def delete_role(role: str):
        """
        Delete a role
        """
        db_role = await _get_db_role(role)
        await db_role.delete()

    @router.get("/roles/{role}/permissions", response_model=List[GetRolePermission])
    async def get_role_permissions(role: str):
        """
        Get all permissions of a role
        """
        db_role = await _get_db_role(role)
        permissions = await ttm.ResourcePermission.filter(
            role=db_role
        ).prefetch_related("role")
        return [
            GetRolePermission(authz_grp=p.authz_grp, role=p.role.name, action=p.action)
            for p in permissions
        ]

    @router.post("/roles/{role}/permissions")
    async def add_role_permission(role: str, body: PostRolePermissions):
        """
        Add a permission to a role
        """
        db_role = await _get_db_role(role)
        await ttm.ResourcePermission.update_or_create(
            authz_grp=body.authz_grp,
            role=db_role,
            action=body.action,
        )

    @router.delete("/roles/{role}/permissions")
    async def delete_role_permission(role: str, body: PostRolePermissions):
        """
        Delete a permission from a role
        """
        db_role = await _get_db_role(role)
        perm = await ttm.ResourcePermission.get_or_none(
            authz_grp=body.authz_grp, role=db_role, action=body.action
        )
        if perm:
            await perm.delete()

    return router
