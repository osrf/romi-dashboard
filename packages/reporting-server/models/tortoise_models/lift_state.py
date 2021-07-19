from enum import Enum

from tortoise import fields, models


class LiftStateEnum(str, Enum):
    MODE_AGV = "avg"
    MODE_EMERGENCY = "emergency"
    MODE_FIRE = "fire"
    MODE_HUMAN = "human"
    MODE_OFFLINE = "offline"
    MODE_UNKNOWN = "unknown"


# FIXME: add all lift states
class LiftMotionStateEnum(str, Enum):
    MOTION_DOWN = "down"
    MOTION_STOPPED = "stopped"
    MOTION_UNKNOWN = "unknown"
    MOTION_UP = "up"


class LiftDoorStateEmun(str, Enum):
    DOOR_CLOSED = "closed"
    DOOR_MOVING = "moving"
    DOOR_OPEN = "open"


class LiftStateService:
    def get_state_name(self, state: int):
        if state == 0:
            return LiftStateEnum.MODE_UNKNOWN
        elif state == 1:
            return LiftStateEnum.MODE_HUMAN
        elif state == 2:
            return LiftStateEnum.MODE_AGV
        elif state == 3:
            return LiftStateEnum.MODE_FIRE
        elif state == 4:
            return LiftStateEnum.MODE_OFFLINE
        elif state == 5:
            return LiftStateEnum.MODE_EMERGENCY

    def get_motion_state_name(self, state: int):
        if state == 0:
            return LiftMotionStateEnum.MOTION_STOPPED
        elif state == 1:
            return LiftMotionStateEnum.MOTION_UP
        elif state == 2:
            return LiftMotionStateEnum.MOTION_DOWN
        elif state == 3:
            return LiftMotionStateEnum.MOTION_UNKNOWN

    def get_door_state_name(self, state: int):
        if state == 0:
            return LiftDoorStateEmun.DOOR_CLOSED
        elif state == 1:
            return LiftDoorStateEmun.DOOR_MOVING
        elif state == 2:
            return LiftDoorStateEmun.DOOR_OPEN


class LiftState(models.Model):
    id = fields.IntField(pk=True)
    lift = fields.ForeignKeyField(
        "models.Lift", related_name="lift_states", on_delete="CASCADE"
    )
    door_state: LiftDoorStateEmun = fields.CharEnumField(
        LiftDoorStateEmun, default=LiftDoorStateEmun.DOOR_CLOSED
    )
    state: LiftStateEnum = fields.CharEnumField(
        LiftStateEnum, default=LiftStateEnum.MODE_UNKNOWN
    )
    destination_floor = fields.CharField(max_length=20)
    motion_state: LiftMotionStateEnum = fields.CharEnumField(
        LiftMotionStateEnum, default=LiftMotionStateEnum.MOTION_STOPPED
    )
    current_floor = fields.CharField(max_length=20)
    session_id = fields.CharField(max_length=200)
    created = fields.DatetimeField(auto_now_add=True)

    service = LiftStateService()
