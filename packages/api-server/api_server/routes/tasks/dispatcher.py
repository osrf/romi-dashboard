from fastapi.exceptions import HTTPException
from rmf_task_msgs.srv import CancelTask as RmfCancelTask
from rmf_task_msgs.srv import SubmitTask as RmfSubmitTask

from ... import models as mdl
from ...gateway import RmfGateway
from ...models import tortoise_models as ttm
from ...permissions import Enforcer, RmfAction


class DispatcherClient:
    def __init__(self, rmf_gateway: RmfGateway):
        self.rmf_gateway = rmf_gateway

    # pylint: disable=unused-argument
    @staticmethod
    async def _get_submit_task_authz_grp(task: RmfSubmitTask.Request):
        # TODO
        return ""

    async def submit_task_request(self, user: mdl.User, req_msg: RmfSubmitTask.Request):
        """
        Task Submission - This function will trigger a ros srv call to the
        dispatcher node, and return a response. Function will return a Task ID.
        Raises "HTTPException" if service call fails.
        """
        authz_grp = await DispatcherClient._get_submit_task_authz_grp(req_msg)
        if not await Enforcer.is_authorized(user, authz_grp, RmfAction.TaskSubmit):
            raise HTTPException(403)

        resp: RmfSubmitTask.Response = await self.rmf_gateway.call_service(
            self.rmf_gateway.submit_task_srv, req_msg
        )

        await ttm.TaskSummary.update_or_create(
            {"authz_grp": authz_grp, "data": {"task_id": resp.task_id}},
            id_=resp.task_id,
        )

        return resp

    def get_sim_time(self):
        if self.rmf_gateway.get_parameter("use_sim_time").value:
            sim_time = self.rmf_gateway.get_clock().now().to_msg()
        else:
            sim_time = None
        return sim_time

    # pylint: disable=unused-argument
    @staticmethod
    async def _get_cancel_task_authz_grp(task: mdl.CancelTask):
        # TODO
        return ""

    async def cancel_task_request(self, task: mdl.CancelTask, user: mdl.User) -> bool:
        """
        Cancel Task - This function will trigger a ros srv call to the
        dispatcher node, and return a response.
        Raises "HTTPException" if service call fails.
        """
        authz_grp = await DispatcherClient._get_cancel_task_authz_grp(task)
        authorized = await Enforcer.is_authorized(user, authz_grp, RmfAction.TaskRead)
        if not authorized:
            raise HTTPException(403)

        req = RmfCancelTask.Request()
        req.requester = "rmf-server"
        req.task_id = task.task_id
        response: RmfCancelTask.Response = await self.rmf_gateway.call_service(
            self.rmf_gateway.cancel_task_srv, req
        )
        if not response.success:
            raise HTTPException(500, response.message)
        return response.success
