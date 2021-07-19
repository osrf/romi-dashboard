import json

from models.tortoise_models.door_state import DoorState


async def doors_state_parser(fullstring: str):
    modified_string = fullstring.replace("door_state:", "")
    door_state_json = json.loads(modified_string)

    return {
        "state": DoorState.service.get_state_name(
            door_state_json["current_mode"]["value"]
        ),
        "name": door_state_json["door_name"],
    }
