from enum import Enum

from tortoise import fields, models


class HealthStatusEmun(str, Enum):
    HEALTHY = "Healthy"
    UNHEALTHY = "Unhealthy"
    DEAD = "Dead"


class Device(models.Model):
    id = fields.IntField(pk=True)
    type = fields.TextField()
    actor = fields.CharField(max_length=25, null=True)


class HealthStatusService:
    def get_health_status(self, status: str):
        if status == "HealthStatus.HEALTHY":
            return HealthStatusEmun.HEALTHY
        elif status == "HealthStatus.UNHEALTHY":
            return HealthStatusEmun.UNHEALTHY
        elif status == "HealthStatus.DEAD":
            return HealthStatusEmun.DEAD


class HealthStatus(models.Model):
    device = fields.ForeignKeyField(
        "models.Device", related_name="health_status", null=True
    )
    health_status = fields.CharField(max_length=25, null=True)
    health_message = fields.TextField(null=True)
    created = fields.DatetimeField(auto_now_add=True)

    service = HealthStatusService()
