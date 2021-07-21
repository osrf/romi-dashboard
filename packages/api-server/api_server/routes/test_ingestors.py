from rmf_ingestor_msgs.msg import IngestorState as RmfIngestorState

from ..models import Ingestor
from ..test.test_fixtures import RouteFixture, try_until


class TestIngestorsRoute(RouteFixture):
    def test_get_ingestors(self):
        pub = self.node.create_publisher(RmfIngestorState, "ingestor_states", 10)
        rmf_ingestor_state = RmfIngestorState(guid="test_ingestor")

        def try_get():
            pub.publish(rmf_ingestor_state)
            return self.session.get(f"{self.base_url}/ingestors/test_ingestor/state")

        resp = try_until(
            try_get,
            lambda x: x.status_code == 200,
        )
        self.assertEqual(resp.status_code, 200)

        # should be able to see it in /ingestors
        resp = self.session.get(f"{self.base_url}/ingestors")
        self.assertEqual(resp.status_code, 200)
        ingestors = [Ingestor(**d) for d in resp.json()]
        self.assertEqual(1, len(ingestors))
        self.assertEqual("test_ingestor", ingestors[0].guid)
