import rclpy.qos
from rmf_building_map_msgs.msg import BuildingMap as RmfBuildingMap

from ..test.test_fixtures import RouteFixture, try_until


class TestBuildingMapRoute(RouteFixture):
    def test_get_building_map(self):
        rmf_building_map = RmfBuildingMap(name="test_map")
        pub = self.node.create_publisher(
            RmfBuildingMap,
            "map",
            rclpy.qos.QoSProfile(
                history=rclpy.qos.HistoryPolicy.KEEP_ALL,
                depth=1,
                reliability=rclpy.qos.ReliabilityPolicy.RELIABLE,
                durability=rclpy.qos.DurabilityPolicy.TRANSIENT_LOCAL,
            ),
        )

        def try_get():
            pub.publish(rmf_building_map)
            return self.session.get(f"{self.base_url}/building_map")

        resp = try_until(
            try_get,
            lambda x: x.status_code == 200,
        )
        self.assertEqual(resp.status_code, 200)
