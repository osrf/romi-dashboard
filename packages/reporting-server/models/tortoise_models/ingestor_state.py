from enum import Enum

from tortoise import fields, models


class IngestorStateEnum(str, Enum):
    IDLE = "idle"
    BUSY = "busy"
    OFFLINE = "offline"


class IngestorStateService:
    def get_state_name(self, state: int):
        if state == 0:
            return IngestorStateEnum.IDLE
        elif state == 1:
            return IngestorStateEnum.BUSY
        elif state == 2:
            return IngestorStateEnum.OFFLINE


class IngestorState(models.Model):
    id = fields.IntField(pk=True)
    state: IngestorStateEnum = fields.CharEnumField(
        IngestorStateEnum, default=IngestorStateEnum.OFFLINE
    )
    guid = fields.CharField(max_length=200)
    created = fields.DatetimeField(auto_now_add=True)

    service = IngestorStateService()
