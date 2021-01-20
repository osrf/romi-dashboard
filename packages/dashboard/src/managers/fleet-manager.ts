import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class FleetManager extends EventEmitter<Events> {
  fleetStates: Record<string, RomiCore.FleetState> = {};

  startSubscription(transport: RomiCore.Transport) {
    this._subscriptions.push(
      transport.subscribe(RomiCore.fleetStates, (fleetState) => {
        this.fleetStates[fleetState.name] = fleetState;
        this.emit('updated');
      }),
    );
  }

  stopAllSubscriptions(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private _subscriptions: RomiCore.Subscription[] = [];
}
