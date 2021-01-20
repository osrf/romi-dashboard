import EventEmitter from 'eventemitter3';
import { Trajectory } from './robot-trajectory-manager';

type Events = {
  updated: [];
};

export enum NegotiationState {
  NOT_RESOLVED = 0,
  RESOLVED,
}

export enum ResolveState {
  UNKNOWN = 0,
  RESOLVED,
  FAILED,
}

export class NegotiationStatus {
  sequence: number[] = [];
  defunct: boolean = false;
  rejected: boolean = false;
  forfeited: boolean = false;
}

export class NegotiationStatusData {
  hasTerminal: boolean = false;
  base: NegotiationStatus = new NegotiationStatus();
  terminal: NegotiationStatus = new NegotiationStatus();
}

export class NegotiationConflict {
  public participantIdsToNames: Record<string, string> = {};
  public participantIdsToStatus: Record<string, NegotiationStatusData> = {};
  public resolved: ResolveState = ResolveState.UNKNOWN;
}

export interface NegotiationTrajectoryRequest {
  request: 'negotiation_trajectory';
  param: {
    conflict_version: number;
    sequence: number[];
  };
}

export interface NegotiationTrajectoryResponse {
  response: 'negotiation_trajectory';
  values: Trajectory[];
}

export class NegotiationStatusManager extends EventEmitter<Events> {
  constructor(url: string) {
    super();
    if (url) this._backendWs = new WebSocket(url);
  }

  allConflicts(): Record<number, NegotiationConflict> {
    return this._conflicts;
  }

  getLastUpdateTS(): number {
    return this._statusUpdateLastTS;
  }

  startSubscription(): void {
    if (!this._backendWs) {
      console.warn('backend websocket not available');
      return;
    }
    if (this._backendWs.readyState === WebSocket.OPEN) {
      this._backendWs.send(JSON.stringify({ request: 'negotiation_update_subscribe' }));

      this._backendWs.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg['type'] === 'negotiation_status') {
          this._statusUpdateLastTS = Date.now();

          const conflictVersion: number = msg['conflict_version'];
          const conflictVersionStr = conflictVersion.toString();

          let conflict = this._conflicts[conflictVersionStr];
          if (conflict === undefined) {
            conflict = new NegotiationConflict();

            const participantId: number = msg['participant_id'];
            conflict.participantIdsToNames[participantId] = msg['participant_name'];

            this._conflicts[conflictVersionStr] = conflict;
          }

          const id: number = msg['participant_id'];
          const idStr = id.toString();
          conflict.participantIdsToNames[idStr] = msg['participant_name'];

          let statusData = conflict.participantIdsToStatus[idStr];
          let status: NegotiationStatus;
          if (statusData === undefined) {
            statusData = new NegotiationStatusData();
            conflict.participantIdsToStatus[idStr] = statusData;
            status = statusData.base;
          } else {
            const seq: number[] = msg['sequence'];
            if (seq.length === 1) status = statusData.base;
            else {
              statusData.hasTerminal = true;
              status = statusData.terminal;
            }
          }

          status.defunct = msg['defunct'];
          status.rejected = msg['rejected'];
          status.forfeited = msg['forfeited'];
          status.sequence = msg['sequence'];

          this.emit('updated');
        } else if (msg['type'] === 'negotiation_conclusion') {
          this._statusUpdateLastTS = Date.now();

          const conflictVersion: number = msg['conflict_version'];
          const conflict = this._conflicts[conflictVersion.toString()];

          if (conflict === undefined) {
            console.warn('Undefined conflict version ' + conflictVersion + ', ignoring...');
            return;
          }

          if (msg['resolved'] === true) conflict.resolved = ResolveState.RESOLVED;
          else conflict.resolved = ResolveState.FAILED;

          this.removeOldConflicts();
        }
      };
    } else {
      this._backendWs.onopen = () => this.startSubscription();
    }
  }

  removeOldConflicts(): void {
    const retainCount = 50;
    let resolved: string[] = [];

    for (const [version, status] of Object.entries(this._conflicts)) {
      if (status.resolved & ResolveState.RESOLVED) resolved.push(version);
    }
    resolved.sort(); // ascending

    // pop from the front until you reach the desired retain count
    while (resolved.length !== 0 && resolved.length > retainCount) {
      const key = resolved[0];
      console.log('removing resolved conflict: ' + key);
      delete this._conflicts[key];
      resolved.splice(0, 1);
    }
  }

  async negotiationTrajectory(
    request: NegotiationTrajectoryRequest,
  ): Promise<NegotiationTrajectoryResponse> {
    const event = await this._send(JSON.stringify(request));
    const resp = JSON.parse(event.data);

    if (resp.values === null) {
      resp.values = [];
    }
    return resp as NegotiationTrajectoryResponse;
  }

  // TODO: temporary function until we unite the 2 websockets
  private async _send(payload: WebSocketSendParam0T): Promise<MessageEvent> {
    if (!this._backendWs) throw Error('Null _backendWs');
    // response should come in the order that requests are sent, this should allow multiple messages
    // in-flight while processing the responses in the order they are sent.
    this._backendWs.send(payload);
    // waits for the earlier response to be processed.
    if (this._ongoingRequest) {
      await this._ongoingRequest;
    }

    this._ongoingRequest = new Promise((res) => {
      this._listenOnce('message', (e) => {
        this._ongoingRequest = null;
        res(e);
      });
    });
    return this._ongoingRequest;
  }

  private _listenOnce<K extends keyof WebSocketEventMap>(
    event: K,
    listener: (e: WebSocketEventMap[K]) => unknown,
  ): void {
    if (!this._backendWs) return;

    this._backendWs.addEventListener(event, (e) => {
      if (!this._backendWs) return;
      this._backendWs.removeEventListener(event, listener);
      listener(e);
    });
  }

  private _conflicts: Record<string, NegotiationConflict> = {};
  private _backendWs?: WebSocket;
  private _ongoingRequest: Promise<MessageEvent> | null = null;
  private _statusUpdateLastTS: number = -1;
}

type WebSocketSendParam0T = Parameters<WebSocket['send']>[0];
