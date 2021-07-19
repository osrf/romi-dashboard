import json

from models.tortoise_models.health import HealthStatus


async def health_status_parser(fullstring: str, health_device: str):
    modified_string = fullstring.replace(health_device + ":", "")
    state_json = json.loads(modified_string)

    return {
        "device": health_device,
        "actor_id": state_json["id"],
        "health_status": HealthStatus.service.get_health_status(
            state_json["health_status"]
        ),
        "health_message": state_json["health_message"],
    }
