from typing import Awaitable, Callable

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OpenIdConnect

from .models import User


class AuthenticationError(Exception):
    pass


class JwtAuthenticator:
    def __init__(self, pem_file: str, aud: str, iss: str):
        """
        Authenticates with a JWT token, the client must send an auth params with
        a "token" key.
        :param pem_file: path to a pem encoded certificate used to verify a token.
        """
        self.aud = aud
        self.iss = iss
        with open(pem_file, "br") as f:
            self._public_key = f.read()

    async def _get_user(self, claims: dict) -> User:
        if not "preferred_username" in claims:
            raise AuthenticationError(
                "expected 'preferred_username' username claim to be present"
            )

        username = claims["preferred_username"]
        return await User.load_from_db(username)

    async def verify_token(self, token: str) -> User:
        try:
            claims = jwt.decode(
                token,
                self._public_key,
                algorithms=["RS256"],
                audience=self.aud,
                issuer=self.iss,
            )
            return await self._get_user(claims)
        except jwt.InvalidTokenError as e:
            raise AuthenticationError(str(e)) from e

    def fastapi_dep(self, oidc_url: str) -> Callable[..., Awaitable[User]]:
        async def dep(
            auth_header: str = Depends(OpenIdConnect(openIdConnectUrl=oidc_url)),
        ):
            parts = auth_header.split(" ")
            if len(parts) != 2 or parts[0].lower() != "bearer":
                raise HTTPException(401, "invalid bearer format")
            try:
                return await self.verify_token(parts[1])
            except AuthenticationError as e:
                raise HTTPException(401, str(e)) from e

        return dep
