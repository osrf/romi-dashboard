import asyncio
import concurrent.futures

from rmf_fleet_msgs.msg import FleetState as RmfFleetState
from rmf_fleet_msgs.msg import RobotState as RmfRobotState
from rmf_task_msgs.msg import TaskSummary as RmfTaskSummary

from ..models import tortoise_models as ttm
from ..test.test_fixtures import RouteFixture, try_until


class TestFleetsRoute(RouteFixture):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        fleet_states = [
            RmfFleetState(
                name="fleet_1",
                robots=[RmfRobotState(name="robot_1"), RmfRobotState(name="robot_2")],
            ),
            RmfFleetState(
                name="fleet_2",
                robots=[RmfRobotState(name="robot_3")],
            ),
        ]
        tasks = [
            RmfTaskSummary(
                task_id="task_1",
                fleet_name="fleet_1",
                robot_name="robot_1",
                state=RmfTaskSummary.STATE_ACTIVE,
            ),
            RmfTaskSummary(
                task_id="task_2",
                fleet_name="fleet_1",
                robot_name="robot_1",
                state=RmfTaskSummary.STATE_PENDING,
            ),
        ]

        fut = concurrent.futures.Future()
        fleet_states_pub = cls.node.create_publisher(RmfFleetState, "fleet_states", 10)
        task_summaries_pub = cls.node.create_publisher(
            RmfTaskSummary, "task_summaries", 10
        )

        async def wait():
            timeout = asyncio.create_task(asyncio.sleep(5))
            while not timeout.done():
                for f in fleet_states:
                    fleet_states_pub.publish(f)
                for t in tasks:
                    task_summaries_pub.publish(t)
                if (
                    await ttm.FleetState.all().count() >= 2
                    and await ttm.RobotState.all().count() >= 3
                    and await ttm.TaskSummary.all().count() >= 2
                ):
                    timeout.cancel()
                    fut.set_result(True)
                    return
                await asyncio.sleep(0.5)
            fut.set_exception(TimeoutError())

        cls.server.app.wait_ready()
        cls.server.app.loop.create_task(wait())
        try:
            fut.result()
        except TimeoutError:
            cls.tearDownClass()
            raise

    def test_get_fleets(self):
        resp = self.session.get(f"{self.base_url}/fleets?fleet_name=fleet_1")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 1)

    def test_get_robots(self):
        resp = self.session.get(
            f"{self.base_url}/fleets/robots?fleet_name=fleet_1&robot_name=robot_1"
        )
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 1)
        self.assertEqual(len(resp_json[0]["tasks"]), 2)


class TestFleetsRoute_RMF(RouteFixture):
    def test_get_fleet_state(self):
        pub = self.node.create_publisher(RmfFleetState, "fleet_states", 10)
        rmf_ingestor_state = RmfFleetState(name="test_fleet")

        def try_get():
            pub.publish(rmf_ingestor_state)
            return self.session.get(f"{self.base_url}/fleets/test_fleet/state")

        resp = try_until(
            try_get,
            lambda x: x.status_code == 200,
        )
        self.assertEqual(resp.status_code, 200)
