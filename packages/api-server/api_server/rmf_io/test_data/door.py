from building_map_msgs.msg import Door


def make_door(name: str) -> Door:
    return Door(
        name=name,
        v1_x=0.0,
        v1_y=0.0,
        v2_x=0.0,
        v2_y=0.0,
        door_type=Door.DOOR_TYPE_SINGLE_SLIDING,
        motion_range=0.0,
        motion_direction=1,
    )
