from typing import Optional

from builtin_interfaces.msg import Time as RosTime
from fastapi import HTTPException
from rmf_task_msgs.msg import Delivery as RmfDelivery
from rmf_task_msgs.msg import Loop as RmfLoop
from rmf_task_msgs.msg import TaskType as RmfTaskType
from rmf_task_msgs.srv import SubmitTask as RmfSubmitTask

from ..models import (
    CleanTaskDescription,
    DeliveryTaskDescription,
    LoopTaskDescription,
    SubmitTask,
    TaskTypeEnum,
)
from ..models import tortoise_models as ttm
from ..ros_time import convert_to_rmf_time


def convert_task_request(task_request: SubmitTask, sim_time: Optional[RosTime] = None):
    """
    :param (obj) task_json:
    :return req_msgs, error_msg
    This is to convert a json task req format to a rmf_task_msgs
    task_profile format. add this accordingly when a new msg field
    is introduced.
    The 'start time' here is refered to the "Duration" from now.
    """

    # NOTE: task request should already be validated by pydantic
    req_msg = RmfSubmitTask.Request()
    req_msg.requester = "rmf_server"  # TODO: Set this as the user id
    if task_request.priority is not None:
        req_msg.description.priority.value = task_request.priority

    if task_request.task_type == TaskTypeEnum.CLEAN:
        desc = task_request.description
        desc: CleanTaskDescription
        req_msg.description.task_type.type = RmfTaskType.TYPE_CLEAN
        req_msg.description.clean.start_waypoint = desc.cleaning_zone
    elif task_request.task_type == TaskTypeEnum.LOOP:
        desc = task_request.description
        desc: LoopTaskDescription
        req_msg.description.task_type.type = RmfTaskType.TYPE_LOOP
        loop = RmfLoop()
        loop.num_loops = desc.num_loops
        loop.start_name = desc.start_name
        loop.finish_name = desc.finish_name
        req_msg.description.loop = loop
    elif task_request.task_type == TaskTypeEnum.DELIVERY:
        desc = task_request.description
        desc: DeliveryTaskDescription
        req_msg.description.task_type.type = RmfTaskType.TYPE_DELIVERY
        delivery = RmfDelivery()
        delivery.pickup_place_name = desc.pickup_place_name
        delivery.pickup_dispenser = desc.pickup_dispenser
        delivery.dropoff_ingestor = desc.dropoff_ingestor
        delivery.dropoff_place_name = desc.dropoff_place_name
        req_msg.description.delivery = delivery
    else:
        return None, "Invalid TaskType"

    rmf_start_time = convert_to_rmf_time(task_request.start_time, sim_time)
    req_msg.description.start_time = rmf_start_time
    return req_msg, ""


async def get_db_task(task_id: str) -> ttm.TaskSummary:
    task = await ttm.TaskSummary.get_or_none(id_=task_id)
    if task is None:
        raise HTTPException(404)
    return task
