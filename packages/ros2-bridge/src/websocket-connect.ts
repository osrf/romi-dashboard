import * as http from 'http';
import WebSocket from 'ws';
import baseLogger from './logger';

export type WebSocketMiddleware = (
  socket: WebSocket,
  req: http.IncomingMessage,
  next: () => void,
) => void;

export default class WebSocketConnect {
  stack: WebSocketMiddleware[] = [];

  constructor(public server: WebSocket.Server) {
    server.on('connection', async (socket, req) => {
      const logger = baseLogger.child({ label: req.socket.remoteAddress });
      socket.setMaxListeners(100);
      socket.on('error', logger.error);
      socket.on('close', () => logger.info('connection closed'));
      logger.info('connection established');

      try {
        for (let mdw of this.stack) {
          await new Promise<void>((res) => mdw(socket, req, res));
        }
      } catch (e) {
        logger.error(e);
        socket.close();
      }
    });
  }

  use(mdw: WebSocketMiddleware) {
    this.stack.push(mdw);
  }
}
