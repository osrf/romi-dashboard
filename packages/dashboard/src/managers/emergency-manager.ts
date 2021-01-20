import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class EmergencyManager extends EventEmitter<Events> {
  alarm(): boolean | null {
    return this._alarmState;
  }

  startSubscription(transport: RomiCore.Transport) {
    this._subscriptions.push(
      transport.subscribe(
        RomiCore.emergency,
        (state) => {
          this._alarmState = state.data;
          this.emit('updated');
        },
        {
          qos: {
            historyPolicy: RomiCore.HistoryPolicy.KeepLast,
            reliabilityPolicy: RomiCore.ReliabilityPolicy.Reliable,
            durabilityPolicy: RomiCore.DurabilityPolicy.TransientLocal,
          },
        },
      ),
    );
  }

  stopAllSubscriptions(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private _alarmState: boolean | null = null;
  private _subscriptions: RomiCore.Subscription[] = [];
}
