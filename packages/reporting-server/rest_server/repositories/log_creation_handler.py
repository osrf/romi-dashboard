import logging

from dependencies import logger
from models.tortoise_models.auth_events import AuthEvents
from models.tortoise_models.container import Container
from models.tortoise_models.raw_log import RawLog
from parsers.auth_event_parser import auth_event_parser
from parsers.log_type_parser import get_log_type

# Function that receives all the logs and store them on the database

logger = logging.getLogger("rest_app:log_creation_handler")


"""
Formats support:

1. [{log:"text or json", kubernetes:{...}  },{log:{...}, kubernetes:{...}]

2. ['text','text','text']

"""


class RawLogHandler:
    @staticmethod
    def _is_valid_request(logs: list):
        if len(logs) == 0:
            return False
        return True

    @staticmethod
    async def _dict_raw_log_handler(log: dict):
        log_level = get_log_type(log["log"], log["stream"])

        if "kubernetes" in log and "container_name" in log["kubernetes"]:
            container = await Container.get_or_create(
                name=log["kubernetes"]["container_name"]
            )

            await RawLog.create(
                level=log_level,
                message=log["log"],
                container=container[0],
            )
        else:
            await RawLog.create(level=log_level, message=log["log"])

    @staticmethod
    async def _text_raw_log_handler(log: str):
        log_level = get_log_type(log)
        await RawLog.create(level=log_level, message=log)

    @staticmethod
    async def create_raw_log(logs: list):
        if not RawLogHandler._is_valid_request(logs):
            return "No valid data"

        error_logs = []

        for log in logs:
            try:
                if isinstance(log, dict):
                    if "log" not in log:
                        error_msg = (
                            "Error: format not supported. Failed to create this log "
                            + str(log)
                        )
                        logger.error(error_msg)
                        error_logs.append(error_msg)
                        continue
                    await RawLogHandler._dict_raw_log_handler(log)

                elif isinstance(log, str):
                    if log.isspace():
                        continue
                    await RawLogHandler._text_raw_log_handler(log)

            except (SyntaxError, ValueError, KeyError) as e:
                error_logs.append("Error:" + str(e) + "Log:" + str(log))

        return error_logs if len(error_logs) > 0 else "Logs were saved correctly"


async def create_keycloak_log(logs: list):
    if len(logs) == 0:
        return "No data received"
    error_logs = []

    for log in logs:
        try:
            # If it not data app, we will skip it because the create_raw_log in theory will register that log
            if "JSON_EVENT::" not in log["log"]:
                continue
            auth_event = await auth_event_parser(log["log"])
            await AuthEvents.create(**auth_event)

        except (SyntaxError, ValueError, KeyError) as e:
            error_logs.append("Error:" + str(e) + "Log:" + str(log))

    return error_logs if len(error_logs) > 0 else "Logs were saved correctly"
