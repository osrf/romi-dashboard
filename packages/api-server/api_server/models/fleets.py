from typing import List

from pydantic import BaseModel

from api_server.models.tasks import Task

from .health import BasicHealth
from .ros_pydantic import rmf_fleet_msgs

FleetState = rmf_fleet_msgs.FleetState
RobotState = rmf_fleet_msgs.RobotState
RobotMode = rmf_fleet_msgs.RobotMode
RobotHealth = BasicHealth
Location = rmf_fleet_msgs.Location


class Fleet(BaseModel):
    name: str
    state: FleetState


class Robot(BaseModel):
    fleet: str
    name: str
    state: RobotState
    tasks: List[Task] = []
