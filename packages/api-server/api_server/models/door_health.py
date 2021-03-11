from tortoise import Model, fields

from .health_status_mixin import HealthStatusMixin


class DoorHealth(Model, HealthStatusMixin):
    name = fields.CharField(255, pk=True)

    def to_dict(self):
        result = super().to_dict()
        result.update({"name": self.name})
        return result
