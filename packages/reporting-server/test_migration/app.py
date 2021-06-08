TORTOISE_ORM = {
    "connections": {"default": "postgres://postgres:postgres@localhost:5432/reporting"},
    "apps": {
        "models": {
            "models": ["models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
