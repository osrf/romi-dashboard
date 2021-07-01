import uvicorn

from .app_config import app_config


def main():
    uvicorn.run(
        "rest_server.app:get_app",
        host=app_config.host,
        port=app_config.port,
        root_path=app_config.public_url.path,
        log_level=app_config.log_level.lower(),
        reload=True,
        workers=2,
    )


if __name__ == "__main__":
    main()
