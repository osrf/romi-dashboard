from typing import Dict, Optional

from building_map_msgs.msg import BuildingMap
from rmf_door_msgs.msg import DoorState
from rx.subject import BehaviorSubject, Subject


class RmfGateway:
    def __init__(
        self,
        initial_door_states: Dict[str, DoorState] = None,
        initial_building_map: Optional[BuildingMap] = None,
    ):
        self.door_states = Subject()
        self.current_door_states: Dict[str, DoorState] = initial_door_states or {}
        self.building_map = BehaviorSubject(initial_building_map)

        self.door_states.subscribe(self._update_door_states)

    def _update_door_states(self, state: DoorState):
        self.current_door_states[state.door_name] = state
