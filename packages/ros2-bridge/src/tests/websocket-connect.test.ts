import WebSocket from 'ws';
import WebSocketConnect, { WebSocketMiddleware } from '../websocket-connect';

describe('WebSocketConnect', () => {
  let app: WebSocketConnect;
  let server: WebSocket.Server;
  let url: string;

  beforeEach(async () => {
    server = new WebSocket.Server({ host: 'localhost', port: 0 });
    await new Promise((res) => server.once('listening', res));
    const port = (server.address() as WebSocket.AddressInfo).port;
    url = `ws://localhost:${port}`;
    app = new WebSocketConnect(server);
  });

  afterEach(() => {
    server.close();
  });

  test('calls each middleware', (done) => {
    const mock1: WebSocketMiddleware = jest.fn((_socket, _req, next) => next());
    const mock2: WebSocketMiddleware = jest.fn(() => {
      done();
    });
    app.use(mock1);
    app.use(mock2);

    const client = new WebSocket(url);
    client.on('open', () => client.send('test'));
  }, 100);

  test('middleware chain stops if next() is not called', (done) => {
    const mock1: WebSocketMiddleware = jest.fn();
    const mock2: WebSocketMiddleware = jest.fn(() => {
      fail('should not be called');
    });
    app.use(mock1);
    app.use(mock2);

    const client = new WebSocket(url);
    client.on('open', () => client.send('test'));
    setTimeout(done, 100);
  }, 200);
});
