import json

from models.tortoise_models.lift_state import LiftState


async def lift_state_parser(fullstring: str):
    modified_string = fullstring.replace("lift_state:", "")
    state_json = json.loads(modified_string)

    # In case it is wrapped in a dict
    motion_state = LiftState.service.get_motion_state_name(
        state_json["motion_state"]["value"]
        if isinstance(state_json["motion_state"], dict)
        else state_json["motion_state"]
    )

    door_state = LiftState.service.get_door_state_name(
        state_json["door_state"]["value"]
        if isinstance(state_json["door_state"], dict)
        else state_json["door_state"]
    )

    state = LiftState.service.get_state_name(
        state_json["current_mode"]["value"]
        if isinstance(state_json["current_mode"], dict)
        else state_json["current_mode"]
    )

    return {
        "name": state_json["lift_name"],
        "state": state,
        "motion_state": motion_state,
        "door_state": door_state,
        "session_id": state_json["session_id"],
        "destination_floor": state_json["destination_floor"],
        "current_floor": state_json["current_floor"],
    }
