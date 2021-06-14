from enum import Enum
from typing import Sequence, TypeVar

from tortoise.query_utils import Q
from tortoise.queryset import QuerySet
from tortoise.transactions import in_transaction

from .models import User
from .models.tortoise_models import ProtectedResource, ProtectedResourceModel

ProtectedResourceT = TypeVar("ProtectedResourceT", bound=ProtectedResourceModel)


class Permission(Enum):
    Read = "read"
    Write = "write"


class RmfRoles(Enum):
    SuperAdmin = "_rmf_superadmin"
    TaskSubmit = "_rmf_task_submit"
    TaskCancel = "_rmf_task_cancel"


class Enforcer:
    @staticmethod
    def _is_superadmin(user: User):
        return "_rmf_superadmin" in user.roles

    @staticmethod
    async def is_authorized(
        r: ProtectedResourceModel, user: User, permission: Permission
    ):
        if r.owner == user.username:
            return True

        perm = await r.permissions.remote_model.filter(
            group__in=user.groups, permission=permission
        ).first()
        return perm is not None

    @staticmethod
    def can_submit_task(user: User):
        return Enforcer._is_superadmin(user) or RmfRoles.TaskSubmit.value in user.roles

    @staticmethod
    def query(
        user: User, r: QuerySet[ProtectedResource]
    ) -> QuerySet[ProtectedResourceModel]:
        if RmfRoles.SuperAdmin.value in user.roles:
            return r.all()
        return r.filter(
            Q(
                permissions__group__in=user.groups,
                permissions__permission=Permission.Read,
            )
            | Q(owner=user.username)
        )

    @staticmethod
    async def save_permissions(
        r: ProtectedResourceModel,
        groups: Sequence[str],
        permissions: Sequence[Permission] = None,
    ):
        """
        Saves the permissions of a protected resource into the database.
        All the groups will be given the same set of permissions.
        """
        permissions = permissions or [Permission.Read]
        async with in_transaction():
            for group in groups:
                for perm in permissions:
                    await r.permissions.remote_model(
                        resource=r, group=group, permission=perm
                    ).save()
