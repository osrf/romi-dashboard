import asyncio
import time

from rmf_task_msgs.msg import TaskSummary as RmfTaskSummary
from tortoise import Tortoise

import api_server.models.tortoise_models as ttm
from api_server.models import TaskSummary


async def main():
    await Tortoise.init(
        db_url="sqlite://:memory:",
        modules={"models": ["api_server.models.tortoise_models"]},
    )
    await Tortoise.generate_schemas()

    count = 1000
    task = RmfTaskSummary(task_id="benchmark")

    start = time.time_ns()
    for _ in range(count):
        await ttm.TaskSummary.save_pydantic(TaskSummary.from_orm(task))
    elapsed = (time.time_ns() - start) / 1000000000
    print(count / elapsed)

    await Tortoise.close_connections()


asyncio.get_event_loop().run_until_complete(main())
