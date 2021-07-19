import json

from models.tortoise_models import FleetState


async def fleet_state_parser(fullstring: str) -> list:
    modified_string = fullstring.replace("fleet_state:", "")
    state_json = json.loads(modified_string)

    if not isinstance(state_json["robots"], list) or len(state_json["robots"]) == 0:
        print("robots should be a list")
        return []

    fleet_list = []
    for robot in state_json["robots"]:
        fleet_list.append(
            {
                "fleet_name": state_json["name"],
                "robot_battery_percent": robot["battery_percent"],
                "robot_location": robot["location"],
                "robot_mode": FleetState.service.get_robot_state_name(
                    robot["mode"]["mode"]
                ),
                "robot_model": robot["model"],
                "robot_name": robot["name"],
                "robot_seq": robot["seq"],
                "robot_task_id": robot["task_id"],
            }
        )

    return fleet_list
