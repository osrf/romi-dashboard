import asyncio
import concurrent.futures
import inspect
import os
import os.path
import threading
import time
import unittest
from typing import Awaitable, Callable, Optional, TypeVar, Union
from uuid import uuid4

import jwt
import rclpy
import rclpy.node
import requests
from urllib3.util.retry import Retry

from ..app import App
from ..app_config import load_config
from ..test.server import BackgroundServer

T = TypeVar("T")


def try_until(
    action: Callable[[], T],
    predicate: Callable[[T], bool],
    timeout=5,
    interval=0.5,
) -> T:
    """
    Do action until an expected result is received.
    Returns the last result.
    """
    end_time = time.time() + timeout
    while time.time() < end_time:
        result = action()
        success = predicate(result)
        if success:
            return result
        time.sleep(interval)
    return result


async def async_try_until(
    action: Callable[[], Awaitable[T]],
    predicate: Union[Callable[[T], Awaitable[bool]], Callable[[T], bool]],
    timeout=5,
    interval=0.5,
) -> Awaitable[T]:
    """
    Do action until an expected result is received.
    Returns the last result.
    """
    end_time = time.time() + timeout
    while time.time() < end_time:
        result = await action()
        success = predicate(result)
        if inspect.isawaitable(success):
            success = await success
        if success:
            return result
        await asyncio.sleep(interval)
    return result


here = os.path.dirname(__file__)
with open(f"{here}/test.key", "br") as f:
    jwt_key = f.read()


def generate_token(username: str):
    return jwt.encode(
        {
            "aud": "test",
            "iss": "test",
            "preferred_username": username,
        },
        jwt_key,
        "RS256",
    )


class RouteFixture(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = App(load_config(f"{os.path.dirname(__file__)}/test_config.py"))
        cls.server = BackgroundServer(cls.app)
        cls.server.start()
        cls.base_url = cls.server.base_url

        retry = Retry(total=5, backoff_factor=0.1)
        adapter = requests.adapters.HTTPAdapter(max_retries=retry)
        cls.session = requests.Session()

        cls.set_user("admin")
        cls.session.headers["Content-Type"] = "application/json"
        cls.session.mount("http://", adapter)

        cls.rcl_ctx = rclpy.Context()
        rclpy.init(context=cls.rcl_ctx)
        cls.rcl_executor = rclpy.executors.SingleThreadedExecutor(context=cls.rcl_ctx)
        cls.node = rclpy.node.Node("test_node", context=cls.rcl_ctx)
        cls.spinning = True

        def spin():
            while cls.spinning:
                rclpy.spin_once(cls.node, executor=cls.rcl_executor, timeout_sec=0.1)

        cls.spin_thread = threading.Thread(target=spin)
        cls.spin_thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.spinning = False
        cls.spin_thread.join()
        cls.node.destroy_node()
        rclpy.shutdown(context=cls.rcl_ctx)

        cls.session.close()

        cls.server.stop()

    @classmethod
    def set_user(cls, username: str):
        token = generate_token(username)
        cls.session.headers["Authorization"] = f"bearer {token}"

    @classmethod
    def run_in_app_loop(cls, work: Awaitable, timeout: Optional[float] = None):
        cls.server.app.wait_ready()
        fut = concurrent.futures.Future()

        async def task():
            fut.set_result(await work)

        cls.server.app.loop.create_task(task())
        return fut.result(timeout)

    def create_user(self, admin: bool = False):
        username = f"user_{uuid4().hex}"
        resp = self.session.post(
            f"{self.base_url}/admin/users",
            json={"username": username, "is_admin": admin},
        )
        self.assertEqual(200, resp.status_code)
        return username

    def create_role(self):
        role_name = f"role_{uuid4().hex}"
        resp = self.session.post(
            f"{self.base_url}/admin/roles", json={"name": role_name}
        )
        self.assertEqual(200, resp.status_code)
        return role_name

    def add_permission(self, role: str, action: str, authz_grp: Optional[str] = ""):
        resp = self.session.post(
            f"{self.base_url}/admin/roles/{role}/permissions",
            json={"action": action, "authz_grp": authz_grp},
        )
        self.assertEqual(200, resp.status_code)

    def assign_role(self, username: str, role: str):
        resp = self.session.post(
            f"{self.base_url}/admin/users/{username}/roles", json={"name": role}
        )
        self.assertEqual(200, resp.status_code)
