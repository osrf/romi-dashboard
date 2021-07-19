from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class User(models.Model):
    id = fields.IntField(pk=True)
    username = fields.TextField(null=True)
    user_id = fields.TextField(null=True)

    def __str__(self):
        return str(self.username)
