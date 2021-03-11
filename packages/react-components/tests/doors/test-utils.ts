import * as RomiCore from '@osrf/romi-js-core-interfaces';

export function makeDoor(door?: Partial<RomiCore.Door>): RomiCore.Door {
  return {
    name: 'test',
    door_type: RomiCore.Door.DOOR_TYPE_SINGLE_SWING,
    motion_direction: 1,
    motion_range: Math.PI / 2,
    v1_x: 0,
    v1_y: 0,
    v2_x: 1,
    v2_y: 1,
    ...door,
  };
}

export function allDoorTypes(): number[] {
  return [
    RomiCore.Door.DOOR_TYPE_DOUBLE_SLIDING,
    RomiCore.Door.DOOR_TYPE_DOUBLE_SWING,
    RomiCore.Door.DOOR_TYPE_DOUBLE_TELESCOPE,
    RomiCore.Door.DOOR_TYPE_SINGLE_SLIDING,
    RomiCore.Door.DOOR_TYPE_SINGLE_SWING,
    RomiCore.Door.DOOR_TYPE_SINGLE_TELESCOPE,
    RomiCore.Door.DOOR_TYPE_UNDEFINED,
    -1,
  ];
}

export function makeDoorState(state?: Partial<RomiCore.DoorState>): RomiCore.DoorState {
  return {
    door_name: 'test',
    current_mode: { value: RomiCore.DoorMode.MODE_CLOSED },
    door_time: { sec: 0, nanosec: 0 },
    ...state,
  };
}

export function allDoorModes(): RomiCore.DoorMode[] {
  return [
    { value: RomiCore.DoorMode.MODE_CLOSED },
    { value: RomiCore.DoorMode.MODE_OPEN },
    { value: RomiCore.DoorMode.MODE_MOVING },
    { value: -1 },
  ];
}
