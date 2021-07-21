import asyncio

from ..models import TaskSummary
from ..models import tortoise_models as ttm
from ..test.test_fixtures import RouteFixture


class TestPaginationQuery(RouteFixture):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        dataset = [
            TaskSummary(
                task_id=f"task_{i}",
                task_profile={"description": {"priority": {"value": i}}},
            )
            for i in range(200)
        ]

        async def save_data():
            await asyncio.gather(
                *(ttm.TaskSummary.save_pydantic(t, "test_group") for t in dataset)
            )

        cls.run_in_app_loop(save_data())

    def test_limit_results(self):
        resp = self.session.get(f"{self.base_url}/tasks")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 100)

    def test_offset(self):
        resp = self.session.get(f"{self.base_url}/tasks?offset=150")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 50)
        self.assertEqual(resp_json[0]["summary"]["task_id"], "task_150")

    def test_order_by(self):
        resp = self.session.get(f"{self.base_url}/tasks?order_by=-priority")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 100)
        self.assertEqual(resp_json[0]["summary"]["task_id"], "task_199")

    def test_order_by_mapped_fields(self):
        resp = self.session.get(f"{self.base_url}/tasks?order_by=-task_id")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 100)
        self.assertEqual(resp_json[0]["summary"]["task_id"], "task_99")

    def test_limit(self):
        resp = self.session.get(f"{self.base_url}/tasks?limit=10")
        self.assertEqual(resp.status_code, 200)
        resp_json = resp.json()
        self.assertEqual(len(resp_json), 10)

    def test_max_limit(self):
        resp = self.session.get(f"{self.base_url}/tasks?limit=101")
        self.assertEqual(resp.status_code, 422)
