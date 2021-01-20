import * as RomiCore from '@osrf/romi-js-core-interfaces';
import EventEmitter from 'eventemitter3';

type Events = {
  updated: [];
};

export default class TaskManager extends EventEmitter<Events> {
  tasks: Record<string, RomiCore.TaskSummary> = {};

  startSubscription(transport: RomiCore.Transport) {
    this._subscriptions.push(
      transport.subscribe(RomiCore.taskSummaries, (taskSummary) => {
        this.tasks[taskSummary.task_id] = taskSummary;
        this.emit('updated');
      }),
    );
  }

  stopAllSubscriptions(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private _subscriptions: RomiCore.Subscription[] = [];
}
