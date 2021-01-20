import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class DispenserStateManager extends EventEmitter<Events> {
  dispenserStates: Record<string, RomiCore.DispenserState> = {};

  startSubscription(transport: RomiCore.Transport) {
    this._subscriptions.push(
      transport.subscribe(RomiCore.dispenserStates, (dispenserState) => {
        this.dispenserStates[dispenserState.guid] = dispenserState;
        this.emit('updated');
      }),
    );
  }
  stopAllSubscriptions(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private _subscriptions: RomiCore.Subscription[] = [];
}
