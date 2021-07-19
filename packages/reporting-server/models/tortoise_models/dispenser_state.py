from enum import Enum

from tortoise import fields, models


class DispenserStateEnum(str, Enum):
    IDLE = "idle"
    BUSY = "busy"
    OFFLINE = "offline"


class DispenserStateService:
    def get_state_name(self, state: int):
        if state == 0:
            return DispenserStateEnum.IDLE
        elif state == 1:
            return DispenserStateEnum.BUSY
        elif state == 2:
            return DispenserStateEnum.OFFLINE


class DispenserState(models.Model):
    id = fields.IntField(pk=True)
    state = fields.CharEnumField(DispenserStateEnum)
    guid = fields.CharField(max_length=200)
    created = fields.DatetimeField(auto_now_add=True)

    service = DispenserStateService()
