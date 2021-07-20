import Debug from 'debug';
import {
  BuildingMap,
  DispenserHealth,
  DispenserState,
  DoorHealth,
  DoorState,
  FleetState,
  IngestorHealth,
  IngestorState,
  LiftHealth,
  LiftState,
  RobotHealth,
  TaskSummary,
} from 'rmf-models';
import { io, Socket } from 'socket.io-client';
import { TaskProgress } from './openapi/models';

const debug = Debug('rmf-client');

// https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
export type Listener<T = unknown> = { bivarianceHack(resp: T): void }['bivarianceHack'];
export type Subscription = Listener;

export class SioClient {
  public sio: Socket;
  private _subscriptions = new Map<Listener, string>();

  constructor(...args: Parameters<typeof io>) {
    this.sio = io(...args);
  }

  subscribe<T>(path: string, listener: Listener<T>): Listener<T> {
    this.sio.emit('subscribe', { path });
    this.sio.on(path, listener);
    this._subscriptions.set(listener, path);
    debug(`subscribed to ${path}`);
    return listener;
  }

  unsubscribe(listener: Listener): void {
    const path = this._subscriptions.get(listener);
    if (path) {
      this.sio.emit('unsubscribe', { path });
      this.sio.off(path, listener);
      this._subscriptions.delete(listener);
      debug(`unsubscribed to ${path}`);
    } else {
      debug('fail to unsubscribe, listener not found in list of subscriptions');
    }
  }

  subscribeBuildingMap(listener: Listener<BuildingMap>): Listener<BuildingMap> {
    return this.subscribe<BuildingMap>(`/building_map`, listener);
  }

  subscribeDoorState(doorName: string, listener: Listener<DoorState>): Listener<DoorState> {
    return this.subscribe<DoorState>(`/doors/${doorName}/state`, listener);
  }

  subscribeDoorHealth(doorName: string, listener: Listener<DoorHealth>): Listener<DoorHealth> {
    return this.subscribe<DoorHealth>(`/doors/${doorName}/health`, listener);
  }

  subscribeLiftState(liftName: string, listener: Listener<LiftState>): Listener<LiftState> {
    return this.subscribe<LiftState>(`/lifts/${liftName}/state`, listener);
  }

  subscribeLiftHealth(liftName: string, listener: Listener<LiftHealth>): Listener<LiftHealth> {
    return this.subscribe<LiftHealth>(`/doors/${liftName}/health`, listener);
  }

  subscribeDispenserState(
    guid: string,
    listener: Listener<DispenserState>,
  ): Listener<DispenserState> {
    return this.subscribe<DispenserState>(`/dispensers/${guid}/state`, listener);
  }

  subscribeDispenserHealth(
    guid: string,
    listener: Listener<DispenserHealth>,
  ): Listener<DispenserHealth> {
    return this.subscribe<DispenserHealth>(`/dispensers/${guid}/health`, listener);
  }

  subscribeIngestorState(guid: string, listener: Listener<IngestorState>): Listener<IngestorState> {
    return this.subscribe<IngestorState>(`/ingestors/${guid}/state`, listener);
  }

  subscribeIngestorHealth(
    guid: string,
    listener: Listener<IngestorHealth>,
  ): Listener<IngestorHealth> {
    return this.subscribe<IngestorHealth>(`/ingestors/${guid}/health`, listener);
  }

  subscribeFleetState(name: string, listener: Listener<FleetState>): Listener<FleetState> {
    return this.subscribe<FleetState>(`/fleets/${name}/state`, listener);
  }

  subscribeRobotHealth(
    fleetName: string,
    robotName: string,
    listener: Listener<RobotHealth>,
  ): Listener<RobotHealth> {
    return this.subscribe<RobotHealth>(`/fleets/${fleetName}/${robotName}/health`, listener);
  }

  subscribeTaskSummary(taskId: string, listener: Listener<TaskSummary>): Listener<TaskSummary> {
    const encoded = taskId.replace('/', '__');
    return this.subscribe<TaskSummary>(`/tasks/${encoded}/summary`, listener);
  }

  subscribeTaskProgress(taskId: string, listener: Listener<TaskProgress>): Listener<TaskProgress> {
    const encoded = taskId.replace('/', '__');
    return this.subscribe<TaskProgress>(`/tasks/${encoded}/summary/progress`, listener);
  }
}

export * from './openapi';
export * from './openapi/models';
