import json

from models.tortoise_models.dispenser_state import DispenserState


async def dispenser_state_parser(fullstring: str):
    modified_string = fullstring.replace("dispenser_state:", "")
    state_json = json.loads(modified_string)

    return {
        "state": DispenserState.service.get_state_name(state_json["mode"]),
        "guid": state_json["guid"],
    }
