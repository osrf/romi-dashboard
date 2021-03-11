import * as msgpack from '@msgpack/msgpack';
import Debug from 'debug';
import type { RpcRequest, RpcResponse } from 'ros2-bridge/src/rpc-middleware';

const debug = Debug('RpcClient');

interface RpcRequestWithId<T> extends RpcRequest<T> {
  id: NonNullable<RpcRequest['id']>;
}

type RpcRequestWithoutId<T> = Omit<RpcRequest<T>, 'id'>;

export default class RpcClient {
  static async connect(url: string, token?: string): Promise<RpcClient> {
    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    await new Promise((res, reject) => {
      const closeListener = (ev: CloseEvent) => {
        reject(ev);
      };
      socket.addEventListener('close', closeListener);
      if (token) {
        socket.addEventListener('open', () => socket.send(token));
        socket.addEventListener('message', (ev) => {
          socket.removeEventListener('close', closeListener);
          res(ev);
        });
      } else {
        socket.addEventListener('open', res);
      }
    });
    return new RpcClient(socket);
  }

  rpcRequest<Result = unknown, Param = unknown>(
    method: string,
    params: Param,
    responseCallback: (resp: Result) => void,
  ): void {
    const request = this._buildRpcRequest(method, params);
    debug(`sending rpc request for "${request.method}", with id "${request.id}"`);
    this.socket.send(msgpack.encode(request));
    this._ongoingRequests[request.id] = responseCallback as any;
  }

  rpcNotify<Param = unknown>(method: string, params: Param): void {
    const request = this._buildRpcNotify(method, params);
    debug(`sending rpc notify for "${request.method}"`);
    this.socket.send(msgpack.encode(request));
  }

  private _idCounter = 0;
  private _ongoingRequests: Record<string | number, (result: unknown) => void> = {};

  private constructor(public socket: WebSocket) {
    socket.addEventListener('message', (ev) => this._onMessage(ev.data));
  }

  private _buildRpcRequest<T>(method: string, params: T): RpcRequestWithId<T> {
    return {
      version: '0',
      method,
      params,
      id: this._idCounter++,
    };
  }

  private _buildRpcNotify<T>(method: string, params: T): RpcRequestWithoutId<T> {
    return {
      version: '0',
      method,
      params,
    };
  }

  private _onMessage(data: any): void {
    const resp = msgpack.decode(data) as RpcResponse;
    if (resp.error) {
      // TODO: error callback
      console.error(resp.error);
      return;
    }
    debug(`receive rpc response for id "${resp.id}"`);
    const cb = this._ongoingRequests[resp.id];
    cb && cb(resp.result);
    if (!resp.more) {
      debug(`received final response for id "${resp.id}"`);
      delete this._ongoingRequests[resp.id];
    }
  }
}
