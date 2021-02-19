import importlib
import os


class AppConfig:
    def __init__(self, dict):
        self.root_path: str = dict["root_path"]
        self.host: str = dict["host"]
        self.port: int = dict["port"]
        self.api_server_url: str = dict["api_server_url"]


def _load_config() -> AppConfig:
    if "RMF_REST_SERVER_CONFIG" in os.environ:
        config_file = os.environ["RMF_REST_SERVER_CONFIG"]
    else:
        config_file = f"{os.path.dirname(__file__)}/default_config.py"

    spec = importlib.util.spec_from_file_location("config", config_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return AppConfig(module.config)


app_config = _load_config()
