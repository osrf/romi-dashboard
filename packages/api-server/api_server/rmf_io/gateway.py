from typing import Dict, Optional

from building_map_msgs.msg import BuildingMap
from rmf_door_msgs.msg import DoorState
from rx.subject import BehaviorSubject, Subject

from ..models import DoorHealth


class RmfGateway:
    def __init__(self,):
        # NOTE: the rx type hints don't actually work https://github.com/ReactiveX/RxPY/issues/514
        self.door_states: Subject[DoorState] = Subject()
        self.current_door_states: Dict[str, DoorState] = {}
        self.door_states.subscribe(self._update_door_states)

        self.door_health: Subject[DoorHealth] = Subject()
        self.current_door_health: Dict[str, DoorHealth] = {}
        self.door_health.subscribe(self._update_door_health)

        self.building_map: BehaviorSubject[Optional[BuildingMap]] = BehaviorSubject(
            None
        )

    def _update_door_states(self, state: DoorState):
        self.current_door_states[state.door_name] = state

    def _update_door_health(self, door_health: DoorHealth):
        self.current_door_health[door_health.name] = door_health
