import asyncio
from typing import Sequence

from rmf_task_msgs.msg import TaskSummary as RmfTaskSummary
from rmf_task_msgs.msg import TaskType as RmfTaskType
from rmf_task_msgs.srv import CancelTask as RmfCancelTask
from rmf_task_msgs.srv import SubmitTask as RmfSubmitTask

from ...models import CancelTask, CleanTaskDescription, SubmitTask, TaskSummary
from ...models import tortoise_models as ttm
from ...permissions import RmfAction
from ...test.test_fixtures import RouteFixture


class TasksFixture(RouteFixture):
    def save_tasks(self, tasks: Sequence[TaskSummary], authz_grp: str):
        async def save_data():
            await asyncio.gather(
                *(ttm.TaskSummary.save_pydantic(t, authz_grp) for t in tasks)
            )

        self.run_in_app_loop(save_data())


class TestTasksRoute(TasksFixture):
    def test_smoke(self):
        #
        # setup mock rmf services
        #
        counter = 0

        def rmf_submit_task(
            _request: RmfSubmitTask.Request, response: RmfSubmitTask.Response
        ):
            nonlocal counter
            counter += 1
            response.success = True
            response.task_id = f"task_{counter}"
            return response

        submit_task_srv = self.node.create_service(
            RmfSubmitTask, "submit_task", rmf_submit_task
        )

        def rmf_cancel_task(
            _request: RmfCancelTask.Request, response: RmfCancelTask.Response
        ):
            response.success = True
            return response

        cancel_task_srv = self.node.create_service(
            RmfCancelTask, "cancel_task", rmf_cancel_task
        )

        user1 = self.create_user(True)
        user2 = self.create_user()
        role1 = self.create_role()
        self.add_permission(role1, RmfAction.TaskRead)
        self.add_permission(role1, RmfAction.TaskSubmit)
        self.add_permission(role1, RmfAction.TaskCancel)
        self.assign_role(user2, role1)
        user3 = self.create_user()
        user4 = self.create_user()
        role2 = self.create_role()
        self.add_permission(role2, RmfAction.TaskRead, "group1")
        self.assign_role(user4, role2)
        self.set_user(user1)

        # admin can submit tasks
        submit_task = SubmitTask(
            task_type=RmfTaskType.TYPE_CLEAN,
            start_time=0,
            description=CleanTaskDescription(cleaning_zone="zone_1"),
            priority=0,
        )
        resp = self.session.post(
            f"{self.base_url}/tasks/submit_task", data=submit_task.json()
        )
        self.assertEqual(200, resp.status_code)
        submitted_task_1 = resp.json()["task_id"]

        # user with task submit role can submit task
        self.set_user(user2)
        resp = self.session.post(
            f"{self.base_url}/tasks/submit_task", data=submit_task.json()
        )
        self.assertEqual(200, resp.status_code)
        submitted_task_2 = resp.json()["task_id"]

        # user without permission cannot submit task
        self.set_user(user3)
        resp = self.session.post(
            f"{self.base_url}/tasks/submit_task", data=submit_task.json()
        )
        self.assertEqual(403, resp.status_code)

        # admin can see submitted task
        self.set_user(user1)
        resp = self.session.get(f"{self.base_url}/tasks")
        tasks = resp.json()
        self.assertEqual(2, len(tasks))
        resp = self.session.get(f"{self.base_url}/tasks/{submitted_task_1}/summary")
        self.assertEqual(200, resp.status_code)

        # user with permission can see submitted task
        self.set_user(user2)
        resp = self.session.get(f"{self.base_url}/tasks")
        tasks = resp.json()
        self.assertEqual(2, len(tasks))
        resp = self.session.get(f"{self.base_url}/tasks/{submitted_task_1}/summary")
        self.assertEqual(200, resp.status_code)

        # user without permission cannot see submitted task
        self.set_user(user3)
        resp = self.session.get(f"{self.base_url}/tasks")
        tasks = resp.json()
        self.assertEqual(0, len(tasks))
        resp = self.session.get(f"{self.base_url}/tasks/{submitted_task_1}/summary")
        self.assertEqual(404, resp.status_code)

        #
        # Cancelling tasks
        #

        # user without permission cannot cancel task
        self.set_user(user4)
        resp = self.session.post(
            f"{self.base_url}/tasks/cancel_task",
            data=CancelTask(task_id=submitted_task_2).json(),
        )
        self.assertEqual(403, resp.status_code)

        # user with permission can cancel task
        self.set_user(user2)
        resp = self.session.post(
            f"{self.base_url}/tasks/cancel_task",
            data=CancelTask(task_id=submitted_task_2).json(),
        )
        self.assertEqual(200, resp.status_code)

        # admin can cancel task
        self.set_user(user1)
        resp = self.session.post(
            f"{self.base_url}/tasks/cancel_task",
            data=CancelTask(task_id=submitted_task_1).json(),
        )
        self.assertEqual(200, resp.status_code)

        #
        # Clean up
        #
        cancel_task_srv.destroy()
        submit_task_srv.destroy()


class TestTasksQuery(TasksFixture):
    def test_query_tasks(self):
        dataset = (
            TaskSummary(
                task_id="task_1",
                fleet_name="fleet_1",
                submission_time={"sec": 1000, "nanosec": 0},
                start_time={"sec": 2000, "nanosec": 0},
                end_time={"sec": 3000, "nanosec": 0},
                robot_name="robot_1",
                state=RmfTaskSummary.STATE_COMPLETED,
                task_profile={
                    "description": {
                        "task_type": {"type": RmfTaskType.TYPE_LOOP},
                        "priority": {"value": 0},
                    }
                },
            ),
            TaskSummary(
                task_id="task_2",
                fleet_name="fleet_2",
                submission_time={"sec": 4000, "nanosec": 0},
                start_time={"sec": 5000, "nanosec": 0},
                end_time={"sec": 6000, "nanosec": 0},
                robot_name="robot_2",
                state=RmfTaskSummary.STATE_ACTIVE,
                task_profile={
                    "description": {
                        "task_type": {"type": RmfTaskType.TYPE_DELIVERY},
                        "priority": {"value": 1},
                    }
                },
            ),
        )

        self.save_tasks(dataset, "test_group")

        resp = self.session.get(f"{self.base_url}/tasks?task_id=task_1,task_2")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 2)

        resp = self.session.get(f"{self.base_url}/tasks?fleet_name=fleet_1")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_1")
        self.assertEqual(items[0]["summary"]["fleet_name"], "fleet_1")

        resp = self.session.get(f"{self.base_url}/tasks?robot_name=robot_1")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_1")
        self.assertEqual(items[0]["summary"]["robot_name"], "robot_1")

        resp = self.session.get(f"{self.base_url}/tasks?state=completed")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_1")
        self.assertEqual(items[0]["summary"]["state"], RmfTaskSummary.STATE_COMPLETED)

        resp = self.session.get(f"{self.base_url}/tasks?task_type=loop")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_1")
        self.assertEqual(
            items[0]["summary"]["task_profile"]["description"]["task_type"]["type"],
            RmfTaskType.TYPE_LOOP,
        )

        resp = self.session.get(f"{self.base_url}/tasks?priority=0")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_1")

        resp = self.session.get(f"{self.base_url}/tasks?submission_time_since=4000")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_2")

        resp = self.session.get(f"{self.base_url}/tasks?start_time_since=5000")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_2")

        resp = self.session.get(f"{self.base_url}/tasks?end_time_since=6000")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["summary"]["task_id"], "task_2")

        # test no match
        resp = self.session.get(
            f"{self.base_url}/tasks?fleet_name=fleet_1&start_time_since=5000"
        )
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 0)

        # no query returns everything
        resp = self.session.get(f"{self.base_url}/tasks")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        items = resp_json
        self.assertEqual(len(items), 2)
