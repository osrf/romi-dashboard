import json

from models.tortoise_models.ingestor_state import IngestorState


async def ingestor_state_parser(fullstring: str):
    modified_string = fullstring.replace("ingestor_state:", "")
    state_json = json.loads(modified_string)

    return {
        "state": IngestorState.service.get_state_name(state_json["mode"]),
        "guid": state_json["guid"],
    }
