import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class LiftStateManager extends EventEmitter<Events> {
  liftStates(): Record<string, RomiCore.LiftState> {
    return { ...this._liftStates };
  }

  startSubscription(transport: RomiCore.Transport) {
    // TODO remove the skip validation when the type problem of available_floors is solved
    transport.subscribe(RomiCore.skipValidation(RomiCore.liftStates), liftState => {
      this._liftStates[liftState.lift_name] = liftState;
      this.emit('updated');
    });
  }

  static liftModeToString(liftMode: number): string {
    switch (liftMode) {
      case RomiCore.LiftState.MODE_AGV:
        return 'AGV';
      case RomiCore.LiftState.MODE_EMERGENCY:
        return 'Emergency';
      case RomiCore.LiftState.MODE_FIRE:
        return 'Fire';
      case RomiCore.LiftState.MODE_HUMAN:
        return 'Human';
      case RomiCore.LiftState.MODE_OFFLINE:
        return 'Offline';
      default:
        return `Unknown (${liftMode})`;
    }
  }

  static doorStateToString(doorState?: number) {
    // Asking for undefined because if the number is 0 it will be false and the DOOR_CLOSED wouldn't be executed.
    if (doorState === undefined) {
      return 'Unknown';
    }

    switch (doorState) {
      case RomiCore.LiftState.DOOR_OPEN:
        return 'Open';
      case RomiCore.LiftState.DOOR_CLOSED:
        return 'Closed';
      case RomiCore.LiftState.DOOR_MOVING:
        return 'Moving';
      default:
        return `Unknown (${doorState})`;
    }
  }

  static motionStateToString(motionState: number): string {
    switch (motionState) {
      case RomiCore.LiftState.MOTION_DOWN:
        return 'Down';
      case RomiCore.LiftState.MOTION_STOPPED:
        return 'Stopped';
      case RomiCore.LiftState.MOTION_UP:
        return 'Up';
      default:
        return `Unknown (${motionState})`;
    }
  }

  private _liftStates: Record<string, RomiCore.LiftState> = {};
}

export class LiftRequestManager {
  static liftModes = [
    RomiCore.LiftRequest.REQUEST_END_SESSION,
    RomiCore.LiftRequest.REQUEST_AGV_MODE,
    RomiCore.LiftRequest.REQUEST_HUMAN_MODE,
  ];

  static doorModes = [
    RomiCore.LiftRequest.DOOR_CLOSED,
    RomiCore.LiftRequest.DOOR_OPEN,
  ]

  static getLiftRequestModes() {
    let listOfModes: Array<any> = [];
    this.liftModes.forEach(element => {
      const key = this.liftModeToString(element);
      const value = element;
      listOfModes.push({ key, value })
    });
    return listOfModes
  }

  static getAllDoorModes() {
    let listOfModes: Array<any> = [];
    this.doorModes.forEach(element => {
      const key = LiftStateManager.doorStateToString(element);
      const value = element;
      listOfModes.push({ key, value })
    });
    return listOfModes
  }

  static getListOfLiftRequestModes() {
    let listOfModes: Array<any> = [];
    this.liftModes.forEach(element => {
      listOfModes.push(this.liftModeToString(element))
    });
    return listOfModes
  }

  static getListOfDoorModes() {
    let listOfModes: Array<any> = [];
    this.doorModes.forEach(element => {
      listOfModes.push(this.doorStateToString(element))
    });
    return listOfModes
  }

  static liftModeToString(liftMode: number) {
    switch (liftMode) {
      case RomiCore.LiftRequest.REQUEST_END_SESSION:
        return 'End Session';
      case RomiCore.LiftRequest.REQUEST_AGV_MODE:
        return 'AVG';
      case RomiCore.LiftRequest.REQUEST_HUMAN_MODE:
        return 'Human';
      default:
        return `Unknown (${liftMode})`;
    }
  }

  static StringToLiftMode(liftMode: string) {
    switch (liftMode) {
      case 'End Session':
        return RomiCore.LiftRequest.REQUEST_END_SESSION;
      case 'AVG':
        return RomiCore.LiftRequest.REQUEST_AGV_MODE;
      case 'Human':
        return RomiCore.LiftRequest.REQUEST_HUMAN_MODE;
      default:
        return RomiCore.LiftRequest.REQUEST_END_SESSION;;
    }
  }

  static StringToDoorState(doorState: string) {
    switch (doorState) {
      case 'Open':
        return RomiCore.LiftRequest.DOOR_OPEN;
      case 'Closed':
        return RomiCore.LiftRequest.DOOR_CLOSED;
    }
  }

  static doorStateToString(doorState: number) {
    switch (doorState) {
      case RomiCore.LiftRequest.DOOR_OPEN:
        return 'Open';
      case RomiCore.LiftRequest.DOOR_CLOSED:
        return 'Closed';
      default:
        return `Unknown (${doorState})`;
    }
  }
}

