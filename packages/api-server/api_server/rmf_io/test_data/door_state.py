from builtin_interfaces.msg import Time
from rmf_door_msgs.msg import DoorMode, DoorState


def make_door_state(name: str, mode: int = DoorMode.MODE_CLOSED) -> DoorState:
    return DoorState(
        door_name=name,
        current_mode=DoorMode(value=mode),
        door_time=Time(sec=0, nanosec=0),
    )
