# pylint: disable=line-too-long

config = {
    "db_url": "sqlite://:memory:",  # TODO: explain how to use different db
    "host": "127.0.0.1",  # ip or hostname to bind the socket to
    "port": 8000,
    "static_path": "/static",  # base path that static files should be served from, MUST start with '/' and MUST NOT end with '/'. Also MUST NOT be the root path (i.e. '/' or '').
    "static_directory": "static",  # the directory where static files should be stored.
}
