from tortoise.fields import (
    CharField,
    ForeignKeyField,
    ForeignKeyRelation,
    ReverseRelation,
)
from tortoise.models import Model


class Role(Model):
    name = CharField(255, pk=True)
    permissions: ReverseRelation["ResourcePermission"]


class ResourcePermission(Model):
    # "obj" in casbin speak
    # This has no foreign key because resources can be given any arbitrary group, sometimes even dynamically.
    authz_grp = CharField(255, index=True)
    # "sub" in casbin speak
    role: ForeignKeyRelation[Role] = ForeignKeyField("models.Role")
    action = CharField(255)


class ProtectedResource:
    authz_grp = CharField(255, null=True, index=True)


# Nest the type definitions in a container class to prevent tortoise from generating schemas for them.
class Types:
    class ProtectedResourceModel(Model, ProtectedResource):
        pass
