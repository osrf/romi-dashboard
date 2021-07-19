from tortoise import fields, models


class Door(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
