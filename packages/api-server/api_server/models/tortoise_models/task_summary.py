from typing import Optional

from rmf_task_msgs.msg import TaskSummary as RmfTaskSummary
from tortoise import Model, fields

from ...ros_time import ros_to_py_datetime
from ..tasks import TaskSummary as PydanticTaskSummary
from .authorization import ProtectedResource
from .json_mixin import JsonMixin


class TaskSummary(Model, JsonMixin, ProtectedResource):
    fleet_name = fields.CharField(255, null=True, index=True)
    submission_time = fields.DatetimeField(null=True, index=True)
    start_time = fields.DatetimeField(null=True, index=True)
    end_time = fields.DatetimeField(null=True, index=True)
    robot_name = fields.CharField(255, null=True, index=True)
    state = fields.IntField(null=True, index=True)
    task_type = fields.IntField(null=True, index=True)
    priority = fields.IntField(null=True, index=True)

    ACTIVE_STATES = [
        RmfTaskSummary.STATE_ACTIVE,
        RmfTaskSummary.STATE_PENDING,
        RmfTaskSummary.STATE_QUEUED,
    ]

    def to_pydantic(self):
        return PydanticTaskSummary(**self.data)

    @staticmethod
    async def save_pydantic(
        task_summary: PydanticTaskSummary, authz_grp: Optional[str] = ""
    ) -> "TaskSummary":
        defaults = {
            "authz_grp": authz_grp,
            "fleet_name": task_summary.fleet_name,
            "submission_time": ros_to_py_datetime(task_summary.submission_time),
            "start_time": ros_to_py_datetime(task_summary.start_time),
            "end_time": ros_to_py_datetime(task_summary.end_time),
            "robot_name": task_summary.robot_name,
            "state": task_summary.state,
            "task_type": task_summary.task_profile.description.task_type.type,
            "priority": task_summary.task_profile.description.priority.value,
            "data": task_summary.dict(),
        }
        result = await TaskSummary.update_or_create(defaults, id_=task_summary.task_id)
        return result[0]
