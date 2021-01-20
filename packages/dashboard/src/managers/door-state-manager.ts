import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class DoorStateManager extends EventEmitter<Events> {
  doorStates: Record<string, RomiCore.DoorState> = {};

  startSubscription(transport: RomiCore.Transport) {
    this._subscriptions.push(
      transport.subscribe(RomiCore.doorStates, (doorState) => {
        this.doorStates[doorState.door_name] = doorState;
        this.emit('updated');
      }),
    );
  }

  stopAllSubscriptions(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
    this._subscriptions = [];
  }

  private _subscriptions: RomiCore.Subscription[] = [];
}
