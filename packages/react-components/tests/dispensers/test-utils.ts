import * as RomiCore from '@osrf/romi-js-core-interfaces';

export function allStateModes(): number[] {
  return [
    RomiCore.DispenserState.IDLE,
    RomiCore.DispenserState.OFFLINE,
    RomiCore.DispenserState.BUSY,
    -1,
  ];
}

export function makeDispenserState(
  dispenserState?: Partial<RomiCore.DispenserState>,
): RomiCore.DispenserState {
  return {
    guid: 'test',
    mode: RomiCore.DispenserState.IDLE,
    request_guid_queue: [],
    seconds_remaining: 0,
    time: { sec: 0, nanosec: 0 },
    ...dispenserState,
  };
}
