import asyncio
import base64
import hashlib
import logging
import threading
from typing import List, Optional, cast

import rclpy.client
import rclpy.node
import rclpy.qos
from fastapi import HTTPException
from rclpy.subscription import Subscription
from rmf_building_map_msgs.msg import AffineImage as RmfAffineImage
from rmf_building_map_msgs.msg import BuildingMap as RmfBuildingMap
from rmf_building_map_msgs.msg import Level as RmfLevel
from rmf_dispenser_msgs.msg import DispenserState as RmfDispenserState
from rmf_door_msgs.msg import DoorRequest as RmfDoorRequest
from rmf_door_msgs.msg import DoorState as RmfDoorState
from rmf_fleet_msgs.msg import FleetState as RmfFleetState
from rmf_ingestor_msgs.msg import IngestorState as RmfIngestorState
from rmf_lift_msgs.msg import LiftRequest as RmfLiftRequest
from rmf_lift_msgs.msg import LiftState as RmfLiftState
from rmf_task_msgs.msg import TaskSummary as RmfTaskSummary
from rmf_task_msgs.srv import CancelTask as RmfCancelTask
from rmf_task_msgs.srv import GetTaskList as RmfGetTaskList
from rmf_task_msgs.srv import SubmitTask as RmfSubmitTask
from rosidl_runtime_py.convert import message_to_ordereddict

from .models import (
    BuildingMap,
    DispenserState,
    DoorState,
    FleetState,
    IngestorState,
    LiftState,
    TaskSummary,
)
from .models import tortoise_models as ttm
from .repositories import StaticFilesRepository
from .rmf_io import RmfEvents


def process_building_map(
    rmf_building_map: RmfBuildingMap,
    static_files: StaticFilesRepository,
) -> BuildingMap:
    """
    1. Converts a `BuildingMap` message to an ordered dict.
    2. Saves the images into `{static_directory}/{map_name}/`.
    3. Change the `AffineImage` `data` field to the url of the image.
    """
    processed_map = message_to_ordereddict(rmf_building_map)

    for i in range(len(rmf_building_map.levels)):
        level: RmfLevel = rmf_building_map.levels[i]
        for j in range(len(level.images)):
            image: RmfAffineImage = level.images[j]
            # look at non-crypto hashes if we need more performance
            sha1_hash = hashlib.sha1()
            sha1_hash.update(image.data)
            fingerprint = base64.b32encode(sha1_hash.digest()).lower().decode()
            relpath = f"{rmf_building_map.name}/{level.name}-{image.name}.{fingerprint}.{image.encoding}"  # pylint: disable=line-too-long
            urlpath = static_files.add_file(image.data, relpath)
            processed_map["levels"][i]["images"][j]["data"] = urlpath
    return BuildingMap(**processed_map)


class RmfGateway(rclpy.node.Node):
    def __init__(
        self,
        rmf_events: RmfEvents,
        static_files: StaticFilesRepository,
        *,
        logger: logging.Logger = None,
    ):
        super().__init__("rmf_api_server")
        self.door_req = self.create_publisher(
            RmfDoorRequest, "adapter_door_requests", 10
        )
        self.lift_req = self.create_publisher(
            RmfLiftRequest, "adapter_lift_requests", 10
        )
        self.submit_task_srv = self.create_client(RmfSubmitTask, "submit_task")
        self.get_tasks_srv = self.create_client(RmfGetTaskList, "get_tasks")
        self.cancel_task_srv = self.create_client(RmfCancelTask, "cancel_task")

        self.rmf_events = rmf_events
        self.static_files = static_files
        self.logger = logger or logging.getLogger(self.__class__.__name__)
        self._subscriptions = cast(List[Subscription], [])
        self._spin_thread: Optional[threading.Thread] = None
        self._stopping = False
        self._loop: asyncio.AbstractEventLoop = None

    async def call_service(self, client: rclpy.client.Client, req, timeout=1):
        """
        Utility to wrap a ros service call in an awaitable,
        raises HTTPException if service call fails.
        """
        fut = client.call_async(req)
        try:
            result = await asyncio.wait_for(fut, timeout=timeout)
            return result
        except asyncio.TimeoutError as e:
            raise HTTPException(503, "ros service call timed out") from e

    def subscribe_all(self):
        door_states_sub = self.create_subscription(
            RmfDoorState,
            "door_states",
            lambda msg: self.rmf_events.door_states.on_next(DoorState.from_orm(msg)),
            10,
        )
        self._subscriptions.append(door_states_sub)

        def convert_lift_state(lift_state: RmfLiftState):
            dic = message_to_ordereddict(lift_state)
            return LiftState(**dic)

        lift_states_sub = self.create_subscription(
            RmfLiftState,
            "lift_states",
            lambda msg: self.rmf_events.lift_states.on_next(convert_lift_state(msg)),
            10,
        )
        self._subscriptions.append(lift_states_sub)

        dispenser_states_sub = self.create_subscription(
            RmfDispenserState,
            "dispenser_states",
            lambda msg: self.rmf_events.dispenser_states.on_next(
                DispenserState.from_orm(msg)
            ),
            10,
        )
        self._subscriptions.append(dispenser_states_sub)

        ingestor_states_sub = self.create_subscription(
            RmfIngestorState,
            "ingestor_states",
            lambda msg: self.rmf_events.ingestor_states.on_next(
                IngestorState.from_orm(msg)
            ),
            10,
        )
        self._subscriptions.append(ingestor_states_sub)

        fleet_states_sub = self.create_subscription(
            RmfFleetState,
            "fleet_states",
            lambda msg: self.rmf_events.fleet_states.on_next(FleetState.from_orm(msg)),
            10,
        )
        self._subscriptions.append(fleet_states_sub)

        task_summaries_sub = self.create_subscription(
            RmfTaskSummary,
            "task_summaries",
            lambda msg: self.rmf_events.task_summaries.on_next(
                TaskSummary.from_orm(msg)
            ),
            10,
        )
        self._subscriptions.append(task_summaries_sub)

        map_sub = self.create_subscription(
            RmfBuildingMap,
            "map",
            lambda msg: self.rmf_events.building_map.on_next(
                process_building_map(msg, self.static_files)
            ),
            rclpy.qos.QoSProfile(
                history=rclpy.qos.HistoryPolicy.KEEP_ALL,
                depth=1,
                reliability=rclpy.qos.ReliabilityPolicy.RELIABLE,
                durability=rclpy.qos.DurabilityPolicy.TRANSIENT_LOCAL,
            ),
        )
        self._subscriptions.append(map_sub)

    def unsubscribe_all(self):
        for sub in self._subscriptions:
            sub.destroy()
        self._subscriptions = []

    async def update_tasks(self):
        """
        Updates the tasks in a RmfRepository with the current tasks in RMF.
        """
        resp: RmfGetTaskList.Response = await self.call_service(
            self.get_tasks_srv, RmfGetTaskList.Request()
        )
        if not resp.success:
            raise HTTPException(500, "service call succeeded but RMF returned an error")
        for task_summary in resp.active_tasks:
            task_summary: RmfTaskSummary
            await ttm.TaskSummary.save_pydantic(TaskSummary.from_orm(task_summary))
        for task_summary in resp.terminated_tasks:
            task_summary: RmfTaskSummary
            await ttm.TaskSummary.save_pydantic(TaskSummary.from_orm(task_summary))
