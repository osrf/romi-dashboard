from enum import Enum

from tortoise import fields, models


class LogLevel(str, Enum):
    CRITICAL = "critical"
    ERROR = "error"
    WARN = "warn"
    INFO = "info"
    DEBUG = "debug"
    UNKNOWN = "unknown"


class RawLog(models.Model):
    id = fields.IntField(pk=True)
    level: LogLevel = fields.CharEnumField(LogLevel, default=LogLevel.INFO)
    message = fields.TextField()
    created = fields.DatetimeField(auto_now_add=True)
    container = fields.ForeignKeyField(
        "models.Container", related_name="containers", null=True
    )

    def __str__(self):
        return str(self.message)
