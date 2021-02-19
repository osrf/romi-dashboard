from abc import ABC, abstractmethod
from typing import Optional


class Authenticator(ABC):
    @abstractmethod
    def authenticate(self, environ: dict, auth: Optional[dict]):
        pass


class AuthenticationError(Exception):
    pass


class StubAuthenticator(Authenticator):
    def authenticate(self, environ: dict, auth: Optional[dict]):
        pass


class JwtAuthenticator(Authenticator):
    def authenticate(self, environ: dict, auth: Optional[dict]):
        # TODO:
        pass
