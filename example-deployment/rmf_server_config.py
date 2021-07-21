from api_server.default_config import config as default_config

config = default_config.update(
    {
        "host": "0.0.0.0",
        "port": 8000,
        "db_url": "postgres://rmf-server:rmf-server@rmf-server-db/rmf-server",
        "public_url": "https://example.com/rmf/api/v1",
        "log_level": "INFO",
        "jwt_public_key": "/jwt-configmap/jwt-pub-key.pub",
        "oidc_url": "https://example.com/auth/realms/rmf-web/.well-known/openid-configuration",
        "aud": "dashboard",
        "iss": "https://example.com/auth/realms/rmf-web",
        "builtin_admin": "example",
    }
)
