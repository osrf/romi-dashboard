# conflicts with isort because of local non-relative import
# pylint: disable=wrong-import-order

TORTOISE_ORM = {
    "connections": {"default": "postgres://postgres:postgres@localhost:5432/testdb"},
    "apps": {
        "models": {
            "models": ["models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
