import os

from api_server.default_config import config

here = os.path.dirname(__file__)

test_port = os.environ.get("RMF_SERVER_TEST_PORT", "8000")
config.update(
    {
        "port": int(test_port),
        "log_level": "CRITICAL",
        "jwt_public_key": f"{here}/../test/test.pub",
        "aud": "test",
        "iss": "test",
    }
)
