import * as RomiCore from '@osrf/romi-js-core-interfaces';

export function allLiftMotion(): number[] {
  return [
    RomiCore.LiftState.MOTION_UP,
    RomiCore.LiftState.MOTION_DOWN,
    RomiCore.LiftState.MOTION_STOPPED,
    RomiCore.LiftState.MOTION_UNKNOWN,
    -1,
  ];
}

export function allLiftModes(): number[] {
  return [
    RomiCore.LiftState.MODE_AGV,
    RomiCore.LiftState.MODE_EMERGENCY,
    RomiCore.LiftState.MODE_FIRE,
    RomiCore.LiftState.MODE_HUMAN,
    RomiCore.LiftState.MODE_OFFLINE,
    RomiCore.LiftState.MODE_UNKNOWN,
    -1,
  ];
}

export function allDoorStates(): number[] {
  return [
    RomiCore.LiftState.DOOR_CLOSED,
    RomiCore.LiftState.DOOR_MOVING,
    RomiCore.LiftState.DOOR_OPEN,
    -1,
  ];
}

export function makeLift(lift?: Partial<RomiCore.Lift>): RomiCore.Lift {
  return {
    name: 'test',
    doors: [
      {
        name: 'door',
        door_type: RomiCore.Door.DOOR_TYPE_DOUBLE_TELESCOPE,
        motion_direction: 1,
        motion_range: Math.PI / 2,
        v1_x: -1,
        v1_y: -1,
        v2_x: 1,
        v2_y: -1,
      },
    ],
    levels: ['L1', 'L2'],
    ref_x: 0,
    ref_y: 0,
    ref_yaw: 0,
    width: 2,
    depth: 2,
    wall_graph: { name: 'test', edges: [], params: [], vertices: [] },
    ...lift,
  };
}

export function makeLiftState(liftState?: Partial<RomiCore.LiftState>): RomiCore.LiftState {
  return {
    lift_name: 'test',
    available_floors: ['L1', 'L2'],
    available_modes: Uint8Array.from([]),
    current_floor: 'L1',
    current_mode: RomiCore.LiftState.MODE_AGV,
    destination_floor: 'L1',
    door_state: RomiCore.LiftState.DOOR_CLOSED,
    lift_time: { sec: 0, nanosec: 0 },
    motion_state: RomiCore.LiftState.MOTION_STOPPED,
    session_id: 'test_session',
    ...liftState,
  };
}
