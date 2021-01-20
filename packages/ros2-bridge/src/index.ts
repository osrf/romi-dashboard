#!/usr/bin/env node

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import WebSocket from 'ws';
import yargs from 'yargs';
import RpcMiddleware from './rpc-middleware';
import authenticator from './authenticator';
import logger from './logger';
import WebSocketConnect from './websocket-connect';

export interface Plugin {
  options(yargs: yargs.Argv): void;
  onLoad(config: unknown, rpc: RpcMiddleware): Promise<void>;
}

async function loadPlugins(): Promise<Record<string, Plugin>> {
  const modules = fs
    .readdirSync(`${__dirname}/plugins`, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const plugins: Record<string, Plugin> = {};
  for (let module of modules) {
    try {
      const plugin = (await import(`./plugins/${module}`)) as Plugin;
      plugin.options(yargs);
      plugins[module] = plugin;
    } catch (e) {
      logger.error(`failed to load plugin "${module}": ${e}`);
    }
  }
  return plugins;
}

async function main() {
  const yargs_ = yargs
    .option('host', {
      description: 'host name or ip address to bind to',
      default: 'localhost',
      type: 'string',
    })
    .option('port', {
      default: 80,
      type: 'number',
    })
    .option('sslCert', {
      implies: 'sslKey',
      type: 'string',
    })
    .option('sslKey', {
      implies: 'sslCert',
      type: 'string',
    })
    .requiresArg(['sslCert', 'sslKey'])
    .option('secret', {
      description: 'secret used to verify auth token',
      type: 'string',
      conflicts: 'publicKey',
    })
    .option('publicKey', {
      description: 'pem encoded key used to verify auth token',
      type: 'string',
      conflicts: 'secret',
    })
    .config();

  const plugins = await loadPlugins();

  const config = yargs_.argv;

  const server = (() => {
    if (config.sslCert && config.sslKey) {
      const redirectServer = http.createServer();
      redirectServer.on('request', (req: http.IncomingMessage, resp: http.ServerResponse) => {
        if (!req.url) {
          resp.statusCode = 500;
          resp.end();
          return;
        }
        resp.statusCode = 301;
        const url = new URL(req.url);
        url.protocol = 'https';
        resp.setHeader('Location', url.href);
        resp.end();
      });

      return https.createServer({
        cert: fs.readFileSync(`${__dirname}/${config.sslCert}`),
        key: fs.readFileSync(`${__dirname}/${config.sslKey}`),
      });
    } else {
      logger.info('serving through http');
      return http.createServer();
    }
  })();
  const wsServer = new WebSocket.Server({ server });

  const app = new WebSocketConnect(wsServer);
  if (config.secret) {
    app.use(authenticator({ type: 'secret', secretOrPublicKey: config.secret }));
  } else if (config.publicKey) {
    app.use(authenticator({ type: 'publicKey', secretOrPublicKey: config.publicKey }));
  } else {
    logger.warn('neither "secret" or "publicKey" is set, authentication is disabled');
  }

  const rpc = new RpcMiddleware();
  for (let [module, plugin] of Object.entries(plugins)) {
    try {
      await plugin.onLoad(config, rpc);
      logger.info(`loaded plugin "${module}"`);
    } catch (e) {
      logger.error(`failed to load plugin "${module}": ${e}`);
    }
  }
  app.use(rpc.middleware);

  process.on('SIGINT', () => {
    // `server.close` does not automatically close sockets so it would cause the app to continue
    // running. Properly closing all sockets would require managing server events and the server
    // does not track the ongoing connections.
    process.exit();
  });
  server.listen(config.port, config.host);
}

main();
