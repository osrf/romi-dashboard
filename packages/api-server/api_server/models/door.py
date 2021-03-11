from building_map_msgs.msg import Door as RmfDoor
from tortoise import fields
from tortoise.models import Model

from .mixins.building_map_msgs_mixins import DoorMixin


class Door(Model, DoorMixin):
    name = fields.CharField(255, pk=True)

    @staticmethod
    async def from_rmf(rmf_door: RmfDoor):
        return Door(
            name=rmf_door.name,
            v1_x=rmf_door.v1_x,
            v1_y=rmf_door.v1_y,
            v2_x=rmf_door.v2_x,
            v2_y=rmf_door.v2_y,
            door_type=rmf_door.door_type,
            motion_range=rmf_door.motion_range,
            motion_direction=rmf_door.motion_direction,
        )

    def to_rmf(self):
        return RmfDoor(
            name=self.name,
            v1_x=self.v1_x,
            v1_y=self.v1_y,
            v2_x=self.v2_x,
            v2_y=self.v2_y,
            door_type=self.door_type,
            motion_range=self.motion_range,
            motion_direction=self.motion_direction,
        )
