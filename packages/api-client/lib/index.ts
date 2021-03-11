import { io, Socket } from 'socket.io-client';
import { BuildingMap, DoorHealth, DoorState } from './models';

export type Topic = 'door_states' | 'door_health' | 'building_map';

export interface ApiClient extends Socket {
  on(event: 'subscribe', listener: (resp: string) => void): this;
  on(event: 'door_states', listener: (resp: DoorState) => void): this;
  on(event: 'door_health', listener: (resp: DoorHealth) => void): this;
  on(event: 'building_map', listener: (resp: BuildingMap) => void): this;
  on(event: string, listener: Function): this; // eslint-disable-line @typescript-eslint/ban-types

  emit(event: 'subscribe', topic: Topic): this;
  emit(event: string, ...args: any[]): this; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function make_client(...args: Parameters<typeof io>): ApiClient {
  return io(...args) as ApiClient;
}
