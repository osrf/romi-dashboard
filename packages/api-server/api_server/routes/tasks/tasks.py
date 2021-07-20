import asyncio
from datetime import datetime
from typing import Callable, Dict, Optional

from fastapi import Depends, HTTPException
from fastapi.param_functions import Query
from fastapi.responses import JSONResponse
from rx import operators as rx_ops

from ...dependencies import WithBaseQuery, base_query_params
from ...fast_io import DataStore, FastIORouter
from ...gateway import RmfGateway
from ...models import (
    CancelTask,
    Pagination,
    SubmitTask,
    SubmitTaskResponse,
    TaskProgress,
    TaskStateEnum,
    TaskTypeEnum,
)
from ...models import tortoise_models as ttm
from ...models.tasks import TaskSummary
from ...rmf_io import RmfBookKeeperEvents, RmfEvents
from ...services.tasks import convert_task_request
from .dispatcher import DispatcherClient
from .utils import convert_task_status_msg


class TasksRouter(FastIORouter):
    def __init__(
        self,
        rmf_events: RmfEvents,
        bookkeeper_events: RmfBookKeeperEvents,
        rmf_gateway_dep: Callable[[], RmfGateway],
    ):
        super().__init__(tags=["Tasks"])
        _dispatcher_client: Optional[DispatcherClient] = None

        def dispatcher_client_dep():
            nonlocal _dispatcher_client
            if _dispatcher_client is None:
                _dispatcher_client = DispatcherClient(rmf_gateway_dep())
            return _dispatcher_client

        class TaskSummaryDataStore(DataStore[TaskSummary]):
            async def get(
                self,
                key: str,
                path_params: Dict[str, str],
            ):
                # FIXME: This would fail if task_id contains "_/"
                task_id = path_params["task_id"].replace("__", "/")
                data = await ttm.TaskSummary.get_or_none(id_=task_id)
                if data is None:
                    return None
                return TaskSummary(**data.data)

            async def set(
                self, key: str, path_params: Dict[str, str], data: TaskSummary
            ):
                # RmfBookKeeper will handle writing to db
                pass

        @self.watch(
            "/{task_id}/summary",
            target=rmf_events.task_summaries,
            response_model=TaskSummary,
            data_store=TaskSummaryDataStore(),
            param_docs={"task_id": "task_id with '/' replaced with '__'"},
        )
        async def get_task_summary(task_summary: TaskSummary):
            return {"task_id": task_summary.task_id.replace("/", "__")}, task_summary

        @self.watch(
            "/{task_id}/summary/progress",
            target=rmf_events.task_summaries,
            response_model=TaskProgress,
            data_store=TaskSummaryDataStore(),
            param_docs={"task_id": "task_id with '/' replaced with '__'"},
        )
        async def get_task_summary_progress(task_summary: TaskSummary):
            task_progress = convert_task_status_msg(task_summary, rmf_gateway_dep())
            return {"task_id": task_summary.task_id.replace("/", "__")}, task_progress

        class GetTasksResponse(Pagination.response_model(TaskProgress)):
            pass

        @self.get("", response_model=GetTasksResponse)
        async def get_tasks(
            with_base_query: WithBaseQuery[ttm.TaskSummary] = Depends(
                base_query_params({"task_id": "id_"})
            ),
            task_id: Optional[str] = Query(
                None, description="comma separated list of task ids"
            ),
            fleet_name: Optional[str] = Query(
                None, description="comma separated list of fleet names"
            ),
            submission_time_since: Optional[datetime] = None,
            start_time_since: Optional[datetime] = None,
            end_time_since: Optional[datetime] = None,
            robot_name: Optional[str] = Query(
                None, description="comma separated list of robot names"
            ),
            state: Optional[str] = Query(
                None, description="comma separated list of states"
            ),
            task_type: Optional[str] = Query(
                None, description="comma separated list of task types"
            ),
            priority: Optional[int] = None,
        ):
            filter_params = {}
            if task_id is not None:
                filter_params["id___in"] = task_id.split(",")
            if fleet_name is not None:
                filter_params["fleet_name__in"] = fleet_name.split(",")
            if submission_time_since is not None:
                filter_params["submission_time__gte"] = submission_time_since
            if start_time_since is not None:
                filter_params["start_time__gte"] = start_time_since
            if end_time_since is not None:
                filter_params["end_time__gte"] = end_time_since
            if robot_name is not None:
                filter_params["robot_name__in"] = robot_name.split(",")
            if state is not None:
                try:
                    filter_params["state__in"] = [
                        TaskStateEnum[s.upper()].value for s in state.split(",")
                    ]
                except KeyError as e:
                    raise HTTPException(422, "unknown state") from e
            if task_type is not None:
                try:
                    filter_params["task_type__in"] = [
                        TaskTypeEnum[t.upper()].value for t in task_type.split(",")
                    ]
                except KeyError as e:
                    raise HTTPException(422, "unknown task type") from e
            if priority is not None:
                filter_params["priority"] = priority

            results = await with_base_query(ttm.TaskSummary.filter(**filter_params))
            results.items = [
                convert_task_status_msg(item.to_pydantic(), rmf_gateway_dep())
                for item in results.items
            ]
            return results

        @self.post("/submit_task", response_model=SubmitTaskResponse)
        async def submit_task(
            submit_task_params: SubmitTask,
            dispatcher_client: DispatcherClient = Depends(dispatcher_client_dep),
        ):
            req_msg, err_msg = convert_task_request(
                submit_task_params, dispatcher_client.get_sim_time()
            )

            if err_msg:
                raise HTTPException(422, err_msg)

            rmf_resp = await dispatcher_client.submit_task_request(req_msg)
            if not rmf_resp.success:
                raise HTTPException(422, rmf_resp.message)

            # wait for the new task summary to be written to db so that subsequent calls
            # to `/tasks` will include the new task.
            fut = asyncio.Future()
            sub = bookkeeper_events.task_summary_written.pipe(
                rx_ops.filter(lambda t: sub.dispose() or t.task_id == rmf_resp.task_id)
            ).subscribe(fut.set_result)
            try:
                # there is a slight chance that the new task is written to db before
                # the ros service call returns. So we put a timeout and ignore the error.
                await asyncio.wait_for(fut, 5)
            except asyncio.TimeoutError:
                pass
            finally:
                sub.dispose()

            return {"task_id": rmf_resp.task_id}

        @self.post("/cancel_task")
        async def cancel_task(
            task: CancelTask,
            dispatcher_client: DispatcherClient = Depends(dispatcher_client_dep),
        ):
            cancel_status = await dispatcher_client.cancel_task_request(task)
            return JSONResponse(content={"success": cancel_status})
