from tortoise import fields, models


class Container(models.Model):
    id = fields.IntField(pk=True)
    name = fields.TextField()
