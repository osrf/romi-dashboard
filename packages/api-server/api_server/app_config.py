import importlib
import os
from typing import Any, Mapping


class AppConfig:
    def __init__(self, config_dict: Mapping[str, Any]):
        self.db_url: str = config_dict["db_url"]
        self.host: str = config_dict["host"]
        self.port: int = config_dict["port"]
        self.static_path: str = config_dict["static_path"]
        self.static_directory: str = config_dict["static_directory"]


def _load_config() -> AppConfig:
    if "RMF_API_SERVER_CONFIG" in os.environ:
        config_file = os.environ["RMF_API_SERVER_CONFIG"]
    else:
        config_file = f"{os.path.dirname(__file__)}/default_config.py"

    spec = importlib.util.spec_from_file_location("config", config_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return AppConfig(module.config)


app_config = _load_config()
