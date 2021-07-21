from rmf_dispenser_msgs.msg import DispenserState as RmfDispenserState

from ..models import Dispenser
from ..test.test_fixtures import RouteFixture, try_until


class TestDispensersRoute(RouteFixture):
    def test_get_dispensers(self):
        pub = self.node.create_publisher(RmfDispenserState, "dispenser_states", 10)
        rmf_dispenser_state = RmfDispenserState(guid="test_dispenser")

        def try_get():
            pub.publish(rmf_dispenser_state)
            return self.session.get(f"{self.base_url}/dispensers/test_dispenser/state")

        resp = try_until(
            try_get,
            lambda x: x.status_code == 200,
        )
        self.assertEqual(resp.status_code, 200)

        # should be able to see it in /dispensers
        resp = self.session.get(f"{self.base_url}/dispensers")
        self.assertEqual(resp.status_code, 200)
        dispensers = [Dispenser(**d) for d in resp.json()]
        self.assertEqual(1, len(dispensers))
        self.assertEqual("test_dispenser", dispensers[0].guid)
