from enum import Enum

from tortoise import fields, models


class RobotStateEnum(str, Enum):
    MODE_IDLE = "closed"
    MODE_CHARGING = "charging"
    MODE_MOVING = "moving"
    MODE_PAUSED = "paused"
    MODE_WAITING = "waiting"
    MODE_EMERGENCY = "emergency"
    MODE_GOING_HOME = "going_home"
    MODE_DOCKING = "docking"
    MODE_ADAPTER_ERROR = "adapter_error"


class RobotStateService:
    def get_robot_state_name(self, state: int):
        if state == 0:
            return RobotStateEnum.MODE_IDLE
        elif state == 1:
            return RobotStateEnum.MODE_CHARGING
        elif state == 2:
            return RobotStateEnum.MODE_MOVING
        elif state == 3:
            return RobotStateEnum.MODE_PAUSED
        elif state == 4:
            return RobotStateEnum.MODE_WAITING
        elif state == 5:
            return RobotStateEnum.MODE_EMERGENCY
        elif state == 6:
            return RobotStateEnum.MODE_GOING_HOME
        elif state == 7:
            return RobotStateEnum.MODE_DOCKING
        elif state == 8:
            return RobotStateEnum.MODE_ADAPTER_ERROR


class FleetState(models.Model):
    id = fields.IntField(pk=True)
    created = fields.DatetimeField(auto_now_add=True)
    fleet = fields.ForeignKeyField(
        "models.Fleet", related_name="fleet_states", null=True
    )
    robot = fields.ForeignKeyField(
        "models.Robot", related_name="fleet_states", null=True
    )
    robot_battery_percent = fields.CharField(max_length=200)
    robot_location = fields.CharField(max_length=200)
    robot_mode: RobotStateEnum = fields.CharEnumField(
        RobotStateEnum, default=RobotStateEnum.MODE_IDLE
    )
    robot_seq = fields.IntField()
    robot_task_id = fields.CharField(max_length=200)

    service = RobotStateService()
