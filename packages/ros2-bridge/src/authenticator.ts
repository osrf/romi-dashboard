import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import WebSocket from 'ws';
import { WebSocketMiddleware } from './websocket-connect';
import baseLogger from './logger';

export interface Options {
  type: 'secret' | 'publicKey';
  secretOrPublicKey: string;
}

export default function authenticator(options: Options): WebSocketMiddleware {
  const secretOrPublicKey = (() => {
    if (options.type === 'publicKey') {
      return fs.readFileSync(options.secretOrPublicKey);
    } else {
      return options.secretOrPublicKey;
    }
  })();

  return (socket, req, next) => {
    socket.once('message', (data) => {
      if (typeof data !== 'string') {
        baseLogger.error('expected token', { label: req.connection.remoteAddress });
        socket.close(undefined, 'unauthorized');
        return;
      }

      try {
        jwt.verify(data, secretOrPublicKey); // will throw if invalid
      } catch (e) {
        baseLogger.error(e, { label: req.connection.remoteAddress });
        socket.close(undefined, 'unauthorized');
        return;
      }
      socket.send('ok');
      next();
    });
  };
}
