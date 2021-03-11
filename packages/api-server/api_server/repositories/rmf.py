from abc import ABC, abstractmethod
from typing import Dict, Optional, Sequence

from building_map_msgs.msg import Door
from rmf_door_msgs.msg import DoorState

from ..models import DoorHealth


class RmfRepository(ABC):
    @abstractmethod
    async def update_door_state(self, door_state: DoorState) -> None:
        """
        Update or create a door state.
        """

    @abstractmethod
    async def read_door_states(self) -> Dict[str, DoorState]:
        """
        Read the list of all current door states.
        """

    @abstractmethod
    async def update_door(self, door: Door) -> None:
        """
        Update or create a door.
        """

    @abstractmethod
    async def read_door(self, name: str) -> Optional[Door]:
        pass

    @abstractmethod
    async def sync_doors(self, doors: Sequence[Door]) -> None:
        """
        Update or create a list of doors and remove current doors not inside the list.
        """

    @abstractmethod
    async def update_door_health(self, door_health: DoorHealth) -> None:
        """
        Update or create door health.
        """

    @abstractmethod
    async def read_door_health(self, door_name: str) -> DoorHealth:
        """
        Read the current door health
        """
