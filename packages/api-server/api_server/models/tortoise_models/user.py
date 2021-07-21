from tortoise.fields import BooleanField, CharField, ManyToManyField, ManyToManyRelation
from tortoise.models import Model

from .authorization import Role


class User(Model):
    username = CharField(255, pk=True)
    is_admin = BooleanField()
    roles: ManyToManyRelation[Role] = ManyToManyField("models.Role")
