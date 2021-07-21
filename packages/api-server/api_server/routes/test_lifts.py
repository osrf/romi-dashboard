from concurrent.futures import Future

from rmf_lift_msgs.msg import LiftRequest as RmfLiftRequest
from rmf_lift_msgs.msg import LiftState as RmfLiftState

from ..test.test_fixtures import RouteFixture, try_until


class TestLiftsRoute(RouteFixture):
    def test_lift_state(self):
        pub = self.node.create_publisher(RmfLiftState, "lift_states", 10)
        rmf_lift_state = RmfLiftState(lift_name="test_lift")
        rmf_lift_state.current_mode = RmfLiftState.MODE_AGV

        def try_get():
            pub.publish(rmf_lift_state)
            return self.session.get(f"{self.base_url}/lifts/test_lift/state")

        resp = try_until(
            try_get,
            lambda x: x.status_code == 200,
        )
        self.assertEqual(resp.status_code, 200)

    def test_lift_request(self):
        fut = Future()
        self.node.create_subscription(
            RmfLiftRequest, "adapter_lift_requests", fut.set_result, 10
        )
        resp = self.session.post(
            f"{self.base_url}/lifts/test_lift/request",
            json={
                "request_type": RmfLiftRequest.REQUEST_AGV_MODE,
                "door_mode": RmfLiftRequest.DOOR_OPEN,
                "destination": "L1",
            },
        )
        self.assertEqual(resp.status_code, 200)
        lift_request: RmfLiftRequest = fut.result(3)
        self.assertEqual(lift_request.lift_name, "test_lift")
