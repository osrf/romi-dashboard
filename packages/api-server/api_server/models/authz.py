from pydantic import BaseModel


class Permission(BaseModel):
    authz_grp: str
    action: str
