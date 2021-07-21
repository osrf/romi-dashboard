from typing import Optional

from ..authenticator import JwtAuthenticator
from ..models import User


def auth_scheme(
    authenticator: Optional[JwtAuthenticator] = None,
    oidc_url: Optional[str] = None,
):
    """
    Returns a tuple containing an authentication and user dependency. The authentication
    dependency should be applied app-wide or router-wide to verify a token. The user
    dependency should be applied on each endpoint that requires the user info.
    """
    if not authenticator:
        # no authentication
        return lambda: User(username="stub", is_admin=True)

    oidc_url = oidc_url or ""

    return authenticator.fastapi_dep(oidc_url)
