from tortoise import fields, models


class Lift(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
