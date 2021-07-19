from models.tortoise_models.raw_log import LogLevel


def get_log_type(fullstring, stream_type="stdout"):

    if "critical" in fullstring.lower():
        return LogLevel.CRITICAL
    elif "error" in fullstring.lower():
        return LogLevel.ERROR
    elif "warn" in fullstring.lower():
        return LogLevel.WARN
    elif "info" in fullstring.lower():
        return LogLevel.INFO
    elif "debug" in fullstring.lower():
        return LogLevel.DEBUG
    else:
        if stream_type == "stderr":
            return LogLevel.ERROR
        return LogLevel.DEBUG
