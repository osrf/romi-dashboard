import json

from models.tortoise_models.task_summary import TaskSummary


async def task_summary_parser(fullstring: str):
    modified_string = fullstring.replace("task_summary:", "")
    state_json = json.loads(modified_string)

    if len(state_json) > 0:
        if len(state_json["status"]) <= 0:
            status = None
        else:
            status = state_json["status"]
        return {
            "fleet_name": state_json["fleet_name"],
            "task_id": state_json["task_id"],
            "task_profile": state_json["task_profile"],
            "state": TaskSummary.service.get_task_state_name(state_json["state"]),
            "status": status,
            "submission_time": state_json["submission_time"],
            "start_time": state_json["start_time"],
            "end_time": state_json["end_time"],
            "robot_name": state_json["robot_name"],
        }
    else:
        return {}
