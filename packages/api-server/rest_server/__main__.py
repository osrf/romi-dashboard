import uvicorn
from .app import app
from .app_config import app_config


def main():
    uvicorn.run(app,
                host=app_config.host,
                port=app_config.port,
                root_path=app_config.root_path)


if __name__ == '__main__':
    main()