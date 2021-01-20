import * as msgpack from '@msgpack/msgpack';
import WebSocket from 'ws';
import baseLogger, { Logger as _Logger } from './logger';
import { WebSocketMiddleware } from './websocket-connect';

export type Logger = _Logger;

export interface RpcRequest<T = unknown> {
  version: string;
  method: string;
  params?: T;
  id?: string | number | null;
}

export interface RpcError {
  code: number;
  message: string;
}

export interface RpcResponse<T = unknown> {
  version: string;
  result?: T;
  more?: boolean;
  error?: RpcError;
  id: string | number;
}

export interface Sender<T = unknown> {
  socket: WebSocket;
  send(data: T): void;
  end(data: T): void;
  error(error: RpcError): void;
}

export type RpcHandler<Param = any, Result = unknown> = (
  params: Param,
  sender: Sender<Result>,
) => Promise<Result | void> | Result | void;

export enum ErrorCodes {
  NoSuchMethod = 1,
  FunctionError = 100,
}

export default class RpcMiddleware {
  middleware: WebSocketMiddleware = (socket, req, next) => {
    socket.on('message', (data) =>
      this._onMessage(
        baseLogger.child({ label: req.connection.remoteAddress }),
        socket,
        data,
        next,
      ),
    );
  };

  registerHandler(method: string, cb: RpcHandler): void {
    this._rpcHandlers[method] = cb;
    baseLogger.info(`registered handler for "${method}"`);
  }

  getLogger(name: string): Logger {
    return baseLogger.child({ label: name });
  }

  private _rpcHandlers: Record<string, RpcHandler> = {};

  private async _onMessage(
    logger: Logger,
    socket: WebSocket,
    data: WebSocket.Data,
    next: () => void,
  ): Promise<void> {
    let req: RpcRequest;
    try {
      req = msgpack.decode(data as Buffer) as RpcRequest;
    } catch (e) {
      logger.error(`decode error: ${e.message}`);
      socket.close(1007, 'malformed data');
      return;
    }

    if (req.version !== '0') {
      logger.error('"version" must be "0"');
      socket.close(1003, 'wrong version');
      return;
    }

    logger.info('received request', req);

    const buildResponse = (response: Partial<RpcResponse>) => {
      return {
        version: '0',
        id: req.id,
        ...response,
      };
    };

    const isNotification = (req: RpcRequest) =>
      typeof req.id !== 'string' && typeof req.id !== 'number';

    const sender: Sender = {
      socket,
      send: (data) => {
        if (isNotification(req)) {
          logger.warn('not sending response for notification request');
          return;
        }
        const payload = msgpack.encode(buildResponse({ result: data, more: true }));
        socket.send(payload);
        logger.verbose('sent response chunk', {
          id: req.id,
          method: req.method,
          payloadLength: payload.length,
        });
      },
      end: (data) => {
        if (isNotification(req)) {
          logger.warn('not sending response for notification request');
          return;
        }
        const payload = msgpack.encode(buildResponse({ result: data }));
        socket.send(payload);
        logger.info('sent response', {
          id: req.id,
          method: req.method,
          payloadLength: payload.length,
        });
      },
      error: (error) => {
        if (isNotification(req)) {
          logger.warn('not sending response for notification request');
          return;
        }
        socket.send(msgpack.encode(buildResponse({ error })));
        logger.info('sent error', { id: req.id, method: req.method, error });
      },
    };

    try {
      if (!this._rpcHandlers.hasOwnProperty(req.method)) {
        logger.error('no handler for method', req);
        sender.error({
          code: ErrorCodes.NoSuchMethod,
          message: 'no such method',
        });
        return;
      }

      const handler = this._rpcHandlers[req.method];
      if (handler.length > 1) {
        logger.info('start streaming response chunks', { id: req.id, method: req.method });
      }
      const handlerRet = await handler(req.params, sender);

      /**
       * handler is "req -> resp" if it only has 1 argument, else it is a "stream" with messages
       * sent in chunks.
       *
       * "req -> resp" handler:
       *   * if it returns void (undefined), we send back "null" as the resp, because "result" is
       *     required on success.
       *   * if it returns any other value, send that as the result.
       * "stream" handler:
       *   * if it returns void (undefined), don't send anything back. The handler will take care
       *     of sending the result in chunks.
       *   * if it returns a value, send that as the result, but always set the "more" flag, the
       *     handler should take care of sending the rest of the chunks.
       */
      if (handlerRet === undefined) {
        if (handler.length === 1) {
          !isNotification(req) && sender.end(null);
        }
      } else {
        if (handler.length === 1) {
          sender.end(handlerRet);
        } else {
          sender.send(handlerRet);
        }
      }
    } catch (e) {
      sender.error({ code: ErrorCodes.FunctionError, message: e.message });
    }
    next();
  }
}
