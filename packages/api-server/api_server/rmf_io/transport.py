from typing import Optional

import rclpy
from building_map_msgs.msg import BuildingMap
from rclpy.node import Node as RosNode
from rclpy.subscription import Subscription
from rmf_door_msgs.msg import DoorState

from .rmf_io import RmfGateway


class RmfTransport:
    def __init__(self, ros2_node: RosNode, rmf_gateway: RmfGateway):
        self.ros2_node = ros2_node
        self.rmf_gateway = rmf_gateway
        self.door_states_sub: Optional[Subscription] = None
        self.building_map_sub: Optional[Subscription] = None

    def subscribe_all(self):
        self.door_states_sub = self.ros2_node.create_subscription(
            DoorState, "door_states", self.rmf_gateway.door_states.on_next, 10
        )

        self.building_map_sub = self.ros2_node.create_subscription(
            BuildingMap,
            "map",
            self.rmf_gateway.building_map.on_next,
            rclpy.qos.QoSProfile(
                history=rclpy.qos.HistoryPolicy.KEEP_LAST,
                depth=1,
                reliability=rclpy.qos.ReliabilityPolicy.RELIABLE,
                durability=rclpy.qos.DurabilityPolicy.TRANSIENT_LOCAL,
            ),
        )

    def unsubscribe_all(self):
        if self.door_states_sub:
            self.door_states_sub.destroy()
            self.door_states_sub = None

        if self.building_map_sub:
            self.building_map_sub.destroy()
            self.building_map_sub = None
