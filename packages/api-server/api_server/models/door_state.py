from rmf_door_msgs.msg import DoorMode as RmfDoorMode
from rmf_door_msgs.msg import DoorState as RmfDoorState
from tortoise import fields
from tortoise.models import Model

from ..ros_time import py_to_ros_time, ros_to_py_datetime
from .door_mode import DoorModeEnum


class DoorState(Model):
    # TODO: foreign key with Door
    door_name = fields.CharField(255)
    current_mode = fields.IntEnumField(DoorModeEnum)
    door_time = fields.DatetimeField()

    class Meta:
        unique_together = ("door_name", "door_time")
        indexes = (("door_name", "door_time"),)

    @staticmethod
    def from_rmf(rmf_door_state: RmfDoorState):
        return DoorState(
            door_name=rmf_door_state.door_name,
            current_mode=rmf_door_state.current_mode.value,
            door_time=ros_to_py_datetime(rmf_door_state.door_time),
        )

    def to_rmf(self):
        return RmfDoorState(
            door_name=self.door_name,
            current_mode=RmfDoorMode(value=self.current_mode),
            door_time=py_to_ros_time(self.door_time),
        )
