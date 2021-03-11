# Getting started

This is a minimal library that wraps `socket.io-client` to provide typings to the api. Below is a minimal example of how to use the api.

```ts
import { make_client, topics } from '../lib';

const client = make_client('http://localhost:8000');
client.emit('subscribe', 'door_states');
client.on('door_states', console.log);
```

# Api

The api server uses a pretty barebones system built off from socket.io. Refer to the [socket.io docs](https://socket.io/docs/v3/client-initialization/) for information regarding the protocol.

There is only one room which the client should emit to, the `subscribe` room. The args should be a string containing to room to subscribe to,

```ts
client.emit('subscribe', 'door_states');
```

upon subscription to a room, the client will:

* receive latest states of all "actors" in the room
  * e.g. subscribing to the `doorStates` room/topic will immediate receive all the last known door states, similarly, subscribing to `doorHealth` will receive all the last known door health statuses.
* receive all future events in the room

after emitting `subscribe`, the client should listen to events

```ts
client.on('door_states', console.log);
```
