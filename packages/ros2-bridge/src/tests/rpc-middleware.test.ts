import * as msgpack from '@msgpack/msgpack';
import WebSocket from 'ws';
import RpcMiddleware, { ErrorCodes, RpcRequest, RpcResponse, Sender } from '../rpc-middleware';
import WebSocketConnect from '../websocket-connect';

function echo(params: unknown) {
  return params;
}

function makeRpcRequest(method: string, params?: unknown, id?: string | number | null): Uint8Array {
  const rpcRequest: RpcRequest = {
    version: '0',
    method,
  };
  if (params !== undefined) {
    rpcRequest.params = params;
  }
  if (id !== undefined) {
    rpcRequest.id = id;
  }
  return msgpack.encode(rpcRequest);
}

let app: WebSocketConnect;
let server: WebSocket.Server;
let url: string;
let rpc: RpcMiddleware;

beforeEach(async () => {
  server = new WebSocket.Server({ host: 'localhost', port: 0 });
  await new Promise((res) => server.once('listening', res));
  const port = (server.address() as WebSocket.AddressInfo).port;
  url = `ws://localhost:${port}`;
  app = new WebSocketConnect(server);
  rpc = new RpcMiddleware();
  app.use(rpc.middleware);
});

afterEach(() => {
  server.close();
});

test('primitive request params', (done) => {
  rpc.registerHandler('test', (params: string) => {
    expect(params).toBe('hello');
    return 'world';
  });

  const client = new WebSocket(url);
  client.on('message', (data: Buffer) => {
    expect(data).toBeInstanceOf(Buffer);
    const resp = msgpack.decode(data) as RpcResponse;
    expect(resp.version).toBe('0');
    expect(resp.id).toBe(0);
    expect(resp.error).toBeUndefined();
    expect(resp.more).toBeUndefined();
    expect(resp.result).toBe('world');
    done();
  });
  client.once('open', () => client.send(makeRpcRequest('test', 'hello', 0)));
});

test('object request params', (done) => {
  rpc.registerHandler('test', (params: { data: string }) => {
    expect(params.data).toBe('hello');
    return { data: 'world' };
  });

  const client = new WebSocket(url);
  client.on('message', (data: Buffer) => {
    expect(data).toBeInstanceOf(Buffer);
    const resp = msgpack.decode(data) as RpcResponse;
    expect(resp.version).toBe('0');
    expect(resp.id).toBe(0);
    expect(resp.error).toBeUndefined();
    expect(resp.more).toBeUndefined();
    expect((resp.result as any).data).toBe('world'); // eslint-disable-line @typescript-eslint/no-explicit-any
    done();
  });
  client.once('open', () => client.send(makeRpcRequest('test', { data: 'hello' }, 0)));
});

test('request using string id results in a response with string id', (done) => {
  rpc.registerHandler('test', echo);

  const client = new WebSocket(url);
  client.on('message', (data: Buffer) => {
    expect(data).toBeInstanceOf(Buffer);
    const resp = msgpack.decode(data) as RpcResponse;
    expect(resp.id).toBe('0');
    done();
  });
  client.once('open', () => client.send(makeRpcRequest('test', 'hello', '0')));
});

[undefined, null].forEach((id) => {
  test(`request with id = "${id}" does not return any results`, (done) => {
    rpc.registerHandler('test', echo);

    const client = new WebSocket(url);
    client.on('message', () => {
      fail('should not receive response');
    });
    client.once('open', () => client.send(makeRpcRequest('test', 'hello', id)));

    setTimeout(done, 100);
  }, 1000);
});

test('returns error message when rpc handler throws error', (done) => {
  rpc.registerHandler('test', () => {
    throw new Error('test error');
  });

  const client = new WebSocket(url);
  client.on('message', (data: Buffer) => {
    const resp = msgpack.decode(data) as RpcResponse;
    expect(resp.result).toBeUndefined();
    expect(resp.error?.code).toBe(ErrorCodes.FunctionError);
    expect(resp.error?.message).toBe('test error');
    done();
  });
  client.once('open', () => client.send(makeRpcRequest('test', 'hello', 0)));
});

/**
 * streaming responses should be interleaved, i.e.
 *
 * odd: 1
 * even: 2
 * odd: 3
 * even: 4
 * ...
 *
 * and not back-to-back, i.e.
 *
 * odd: 1,
 * odd: 3,
 * even: 2,
 * even: 4
 * ...
 */
test('streaming endpoints are interleaved', (done) => {
  const senders: Record<string, Sender> = {};

  const sendResponses = () => {
    if (!senders['even'] || !senders['odd']) {
      fail();
    }
    for (let i = 1; i <= 8; ++i) {
      if (i % 2 === 0) {
        senders['even'].send(i);
      } else {
        senders['odd'].send(i);
      }
    }
    senders['odd'].end(9);
    senders['even'].end(10);
  };

  rpc.registerHandler('testEven', (_, sender) => {
    senders['even'] = sender;
    if (senders['odd']) {
      sendResponses();
    }
  });

  rpc.registerHandler('testOdd', (_, sender) => {
    senders['odd'] = sender;
    if (senders['even']) {
      sendResponses();
    }
  });

  const received: number[] = [];
  const client = new WebSocket(url);
  client.on('message', (data: Buffer) => {
    const resp = msgpack.decode(data) as RpcResponse<number>;
    received.push(resp.result!);
    if (received.length === 10) {
      for (let i = 0; i < 10; ++i) {
        expect(received[i]).toBe(i + 1);
      }
      done();
    }
  });
  client.once('open', () => {
    client.send(makeRpcRequest('testEven', undefined, 0));
    client.send(makeRpcRequest('testOdd', undefined, 1));
  });
}, 10000);

test('sending string payload results in websocket error 1007', (done) => {
  const client = new WebSocket(url);
  client.on('close', (code) => {
    expect(code).toBe(1007);
    done();
  });
  client.once('open', () => client.send('hello!'));
});

test('sending invalid binary payload results in websocket error 1007', (done) => {
  const client = new WebSocket(url);
  client.on('close', (code) => {
    expect(code).toBe(1007);
    done();
  });
  const payload = Buffer.alloc(4, 0xdeadbeef);
  client.once('open', () => client.send(payload));
});

test('request with unregistered method return no such method error', (done) => {
  const client = new WebSocket(url);
  client.on('message', (data) => {
    const resp = msgpack.decode(data as Buffer) as RpcResponse;
    expect(resp.error?.code).toBe(ErrorCodes.NoSuchMethod);
    expect(resp.error?.message).toBe('no such method');
    done();
  });
  client.once('open', () => client.send(makeRpcRequest('test', 'hello', 0)));
});

test('request for js internal methods returns no such method error', (done) => {
  const client = new WebSocket(url);
  client.on('message', (data) => {
    const resp = msgpack.decode(data as Buffer) as RpcResponse;
    expect(resp.error?.code).toBe(ErrorCodes.NoSuchMethod);
    expect(resp.error?.message).toBe('no such method');
    done();
  });
  client.once('open', () => client.send(makeRpcRequest('__proto__', undefined, 0)));
});
