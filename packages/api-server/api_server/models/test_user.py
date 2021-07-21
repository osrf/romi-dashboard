import unittest

from tortoise import Tortoise

from api_server.test import init_db

from . import User
from . import tortoise_models as ttm


class TestUser(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await init_db()

    async def asyncTearDown(self):
        await Tortoise.close_connections()

    async def test_load_from_db(self):
        await ttm.User.create(username="test_user", is_admin=True)
        user = await User.load_from_db("test_user")
        self.assertEqual("test_user", user.username)
        self.assertTrue(user.is_admin)
        self.assertEqual(0, len(user.roles))

        # automatically creates an user if it does not exist
        user = await User.load_from_db("test_user2")
        self.assertEqual("test_user2", user.username)
        self.assertFalse(user.is_admin)
        self.assertEqual(0, len(user.roles))
