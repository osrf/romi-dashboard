import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class LiftStateManager extends EventEmitter<Events> {
  liftStates: Record<string, RomiCore.LiftState> = {};

  startSubscription(transport: RomiCore.Transport) {
    this._subscriptions.push(
      transport.subscribe(RomiCore.liftStates, (liftState) => {
        this.liftStates[liftState.lift_name] = liftState;
        this.emit('updated');
      }),
    );
  }

  stopAllSubscriptions(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
    this._subscriptions = [];
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

  static doorStateToString(doorState: number): string {
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

  private _subscriptions: RomiCore.Subscription[] = [];
}

export interface requestManagerModes {
  [key: string]: number;
}
export class LiftRequestManager {
  static readonly liftRequestModes = [
    RomiCore.LiftRequest.REQUEST_END_SESSION,
    RomiCore.LiftRequest.REQUEST_AGV_MODE,
    RomiCore.LiftRequest.REQUEST_HUMAN_MODE,
  ];

  static readonly doorModes = [RomiCore.LiftRequest.DOOR_CLOSED, RomiCore.LiftRequest.DOOR_OPEN];

  static getLiftRequestModes(): requestManagerModes {
    let modes: requestManagerModes = {};
    this.liftRequestModes.forEach((element) => {
      const key = this.requestModeToString(element);
      modes[key] = element;
    });
    return modes;
  }

  static getDoorModes(): requestManagerModes {
    let modes: requestManagerModes = {};
    this.doorModes.forEach((element) => {
      const key = this.doorStateToString(element);
      modes[key] = element;
    });
    return modes;
  }

  static requestModeToString(requestMode: number): string {
    switch (requestMode) {
      case RomiCore.LiftRequest.REQUEST_END_SESSION:
        return 'End Session';
      case RomiCore.LiftRequest.REQUEST_AGV_MODE:
        return 'AGV';
      case RomiCore.LiftRequest.REQUEST_HUMAN_MODE:
        return 'Human';
      default:
        return `Unknown (${requestMode})`;
    }
  }

  static doorStateToString(doorState: number): string {
    switch (doorState) {
      case RomiCore.LiftState.DOOR_OPEN:
        return 'Open';
      case RomiCore.LiftState.DOOR_CLOSED:
        return 'Closed';
      default:
        return `Unknown (${doorState})`;
    }
  }
}
