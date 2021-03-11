from rmf_door_msgs.msg import DoorMode as RmfDoorMode
from rmf_door_msgs.msg import DoorState as RmfDoorState
from tortoise import fields
from tortoise.models import Model

from ..ros_time import py_to_ros_time, ros_to_py_datetime


class DoorState(Model):
    # KP: We could have a FK to Door,
    # but I decided against it to make things easier (pesky race conditions).
    # If we receive a door name that does not exist in the building,
    # just take it at face value and write into the database regardless.
    door_name = fields.CharField(255, pk=True)
    # Could use IntEnumField, but to make things easier, just allow any value.
    # If we received a door state with invalid mode, just take it at face value and write
    # into the db regardless.
    current_mode = fields.SmallIntField()
    door_time = fields.DatetimeField()

    @staticmethod
    async def from_rmf(rmf_door_state: RmfDoorState):
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
