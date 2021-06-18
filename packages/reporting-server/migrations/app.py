import importlib.util
import os

if "RMF_REPORT_REST_SERVER_CONFIG" in os.environ:
    config_file = os.environ["RMF_REPORT_REST_SERVER_CONFIG"]
    spec = importlib.util.spec_from_file_location("config", config_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    url = module.config.db_url

else:
    host = os.environ.get("POSTGRES_HOST", "localhost")
    port = os.environ.get("POSTGRES_PORT", None)
    user = os.environ.get("POSTGRES_USER", "postgres")
    password = os.environ.get("POSTGRES_PASSWORD", "postgres")
    database = os.environ.get("POSTGRES_DB", "reporting")
    url_user_password_host = "postgres://" + user + ":" + password + "@" + host
    if port:
        url = url_user_password_host + ":" + port + "/" + database
    else:
        url = url_user_password_host + "/" + database

TORTOISE_ORM = {
    "connections": {"default": url},
    "apps": {
        "models": {
            "models": ["aerich.models"],
            "default_connection": "default",
        },
    },
}
