import importlib
import os
import urllib.parse
from dataclasses import dataclass
from typing import Optional


@dataclass
class AppConfig:
    host: str
    port: int
    db_url: str
    public_url: urllib.parse.ParseResult
    static_directory: str
    log_level: str
    builtin_admin: str
    jwt_public_key: Optional[str]
    oidc_url: Optional[str]
    aud: str
    iss: Optional[str]

    def __post_init__(self):
        self.public_url = urllib.parse.urlparse(self.public_url)


def load_config(config_file: str) -> AppConfig:
    spec = importlib.util.spec_from_file_location("config", config_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    config = AppConfig(**module.config)
    if "RMF_API_SERVER_LOG_LEVEL" in os.environ:
        config.log_level = os.environ["RMF_API_SERVER_LOG_LEVEL"]
    return config


# The default config automatically loaded as a singleton
if "RMF_API_SERVER_CONFIG" in os.environ:
    default_config_file = os.environ["RMF_API_SERVER_CONFIG"]
else:
    default_config_file = f"{os.path.dirname(__file__)}/default_config.py"
default_config = load_config(default_config_file)
