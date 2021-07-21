import unittest

from tortoise import Tortoise
from tortoise.fields import CharField
from tortoise.models import Model as TortoiseModel

from api_server.test import init_db

from .models import User
from .models.tortoise_models import ProtectedResource, ResourcePermission, Role
from .permissions import Enforcer


class Greeting(TortoiseModel, ProtectedResource):
    message = CharField(255, pk=True)


class TestPermissions(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await init_db(
            [
                "api_server.test_permissions",
                "api_server.models.tortoise_models.authorization",
            ]
        )

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_user_without_permissions_cannot_query_resources(self):
        role = await Role.create(name="test_role")
        await ResourcePermission.create(
            authz_grp="test_group", role=role, action="test_action"
        )

        user = User(username="test_user", roles=["test_role"])
        await Greeting.create(message="hello", authz_grp="test_group")

        # user with permission can see resource
        q = Enforcer.query(user, Greeting, "test_action").count()
        self.assertEqual(1, await q)

        # user without permission cannot see the resource
        user2 = User(username="test_user2")
        q = Enforcer.query(user2, Greeting, "test_action").count()
        self.assertEqual(0, await q)

    async def test_user_without_permissions_is_not_authorized_to_perform_action(self):
        role = await Role.create(name="test_role")
        await ResourcePermission.create(
            authz_grp="test_group", role=role, action="test_action"
        )

        user = User(username="test_user", roles=["test_role"])
        greeting = await Greeting.create(message="hello", authz_grp="test_group")

        authorized = await Enforcer.is_authorized(
            user, greeting.authz_grp, "test_action"
        )
        self.assertTrue(authorized)

        user2 = User(username="test_user2")
        authorized = await Enforcer.is_authorized(
            user2, greeting.authz_grp, "test_action"
        )
        self.assertFalse(authorized)
