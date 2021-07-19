from enum import Enum

from tortoise import fields, models


class DoorStateEnum(str, Enum):
    CLOSED = "closed"
    MOVING = "moving"
    OPEN = "open"
    OFFLINE = "offline"
    UNKNOWN = "unknown"


class DoorStateService:
    def get_state_name(self, door_state: int):
        if door_state == 0:
            return DoorStateEnum.CLOSED
        elif door_state == 1:
            return DoorStateEnum.MOVING
        elif door_state == 2:
            return DoorStateEnum.OPEN
        elif door_state == 3:
            return DoorStateEnum.OFFLINE
        elif door_state == 4:
            return DoorStateEnum.UNKNOWN
        else:
            return DoorStateEnum.UNKNOWN


class DoorState(models.Model):
    id = fields.IntField(pk=True)
    state: DoorStateEnum = fields.CharEnumField(
        DoorStateEnum, default=DoorStateEnum.UNKNOWN
    )
    door = fields.ForeignKeyField("models.Door", related_name="door_states", null=True)
    created = fields.DatetimeField(auto_now_add=True)

    service = DoorStateService()
