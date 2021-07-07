from copy import deepcopy

from rest_server.default_config import config as default_config

config = deepcopy(default_config)
config["host"] = "0.0.0.0"
config["port"] = 8002
config["port_fluentd"] = 8003
config[
    "db_url"
] = "postgres://reporting-server:reporting-server@reporting-server-db/reporting-server"
config["public_url"] = "https://ntu.demo.open-rmf.org/logserver/api/v1"
config["log_level"] = "INFO"
config["jwt_public_key"] = "/jwt-configmap/jwt-pub-key.pub"
config[
    "oidc_url"
] = "https://ntu.demo.open-rmf.org/auth/realms/rmf-web/.well-known/openid-configuration"
config["aud"] = "reporting"
config["iss"] = "https://ntu.demo.open-rmf.org/auth/realms/rmf-web"
