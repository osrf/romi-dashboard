import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { RomiService, RomiTopic } from '@osrf/romi-js-core-interfaces';
import RclnodejsTransport from '@osrf/romi-js-rclnodejs-transport';
import deepEqual from 'fast-deep-equal';
import { Argv } from 'yargs';
import RpcMiddleware, { Logger, Sender } from '../../rpc-middleware';

export function options(yargs: Argv) {
  return yargs.option('ros2NodeName', {
    default: 'romi_dashboard_server',
    type: 'string',
  });
}

type ConfigType = ReturnType<typeof options>['argv'];

// TODO: We can't send functions across websockets, in the future, we can drop the depdency on
// `RomiTopic` and `RomiService`, or have the next version of the `romi-js` move the validation to
// the transport.
export type Ros2Topic<Message = unknown, T = Omit<RomiTopic<Message>, 'validate'>> = {
  -readonly [P in keyof T]: T[P];
};
export type Ros2Service<
  Request = unknown,
  Response = unknown,
  T = Omit<RomiService<Request, Response>, 'validateRequest' | 'validateResponse'>
> = { -readonly [P in keyof T]: T[P] };

export interface SubscribeParams<T = unknown> {
  topic: Ros2Topic<T>;
}

export interface SubscribeResult {
  id: number;
}

export interface UnsubscribeParams {
  id: number;
}

export interface MessageResult<T = unknown> {
  message: T;
}

export interface CreatePublisherParams<T = unknown> {
  topic: Ros2Topic<T>;
}

export interface PublishParams<T = unknown> {
  id: number;
  message: T;
}

export interface DestroyPublisherParams {
  id: number;
}

export interface ServiceCallParams<T = unknown> {
  request: T;
  service: Ros2Service<T, unknown>;
}

interface PublisherRecord {
  topic: Ros2Topic;
  publisher: RomiCore.Publisher<unknown>;
}

interface SubscriptionRecord {
  topic: Ros2Topic;
  subscription: RomiCore.Subscription;
  callbacks: Record<number, (msg: unknown) => void>;
}

export async function onLoad(config: ConfigType, rpc: RpcMiddleware): Promise<void> {
  const rosArgs = process.env['RCLNODEJS_ROS_ARGS']
    ? JSON.parse(process.env['RCLNODEJS_ROS_ARGS'])
    : undefined;
  const transport = await RclnodejsTransport.create(config.ros2NodeName, rosArgs);
  const plugin = new Ros2Plugin(transport, rpc.getLogger('ros2'));
  rpc.registerHandler('ros2Subscribe', (params, send) => plugin.subscribe(params, send));
  rpc.registerHandler('ros2Unsubscribe', (params) => plugin.unsubscribe(params));
  rpc.registerHandler('ros2CreatePublisher', (params, send) =>
    plugin.createPublisher(params, send),
  );
  rpc.registerHandler('ros2Publish', (params) => plugin.publish(params));
  rpc.registerHandler('ros2ServiceCall', (params) => plugin.serviceCall(params));
}

export default class Ros2Plugin {
  get subscriptionCount(): number {
    return Object.keys(this._subscriptions).length;
  }

  get innerSubscriptionCount(): number {
    return this._innerSubscriptions.length;
  }

  get publisherCount(): number {
    return Object.keys(this._publishers).length;
  }

  get innerPublisherCount(): number {
    return this._innerPublishers.length;
  }

  constructor(public transport: RomiCore.Transport, private _logger: Logger) {}

  subscribe(params: SubscribeParams, sender: Sender<MessageResult>): SubscribeResult {
    const id = this._idCounter++;

    sender.socket.once('close', () => {
      this._removeInnerHandler(id);
    });

    const found = this._innerSubscriptions.find((record) => deepEqual(record.topic, params.topic));
    let record: SubscriptionRecord;
    if (found) {
      record = found;
    } else {
      const newRecord: SubscriptionRecord = {
        callbacks: {
          [id]: (msg) => sender.send({ message: msg }),
        },
        subscription: this.transport.subscribe(this.toRomiTopic(params.topic), (msg) => {
          const cbs = Object.values(newRecord.callbacks);
          if (cbs.length > 0) {
            cbs.forEach((cb) => cb(msg));
            this._logger.verbose('sent subscription update', {
              topic: params.topic.topic,
              numOfClients: cbs.length,
            });
          }
        }),
        topic: params.topic,
      };
      this._logger.info('created inner subscription', { topic: params.topic.topic });
      this._innerSubscriptions.push(newRecord);
      record = newRecord;
    }
    record.callbacks[id] = (msg) => sender.send({ message: msg });
    this._subscriptions[id] = record;
    this._logger.info('added subscription', { id, topic: params.topic.topic });
    return { id: id };
  }

  unsubscribe(params: UnsubscribeParams): void {
    const { id } = params;
    this._removeInnerHandler(id);
  }

  createPublisher(params: CreatePublisherParams, sender: Sender<number>): void {
    const id = this._idCounter++;

    sender.socket.once('close', () => {
      delete this._publishers[id];
      this._logger.info('removed publisher', { id, topic: params.topic.topic });
    });

    const found = this._innerPublishers.find((record) => deepEqual(record.topic, params.topic));
    let record: PublisherRecord;
    if (found) {
      record = found;
    } else {
      const newRecord: PublisherRecord = {
        publisher: this.transport.createPublisher(this.toRomiTopic(params.topic)),
        topic: params.topic,
      };
      this._logger.info('created inner publisher', { topic: params.topic.topic });
      record = newRecord;
      this._innerPublishers.push(record);
    }
    this._publishers[id] = record;
    this._logger.info('added publisher', { id, topic: params.topic.topic });
    sender.end(id);
  }

  publish(params: PublishParams): void {
    const record = this._publishers[params.id];
    record && record.publisher.publish(params.message);
    this._logger.info('publish message', { id: params.id, topic: record.topic.topic });
  }

  async serviceCall(params: ServiceCallParams): Promise<unknown> {
    return this.transport.call(this.toRomiService(params.service), params.request);
  }

  toRomiTopic<Message = unknown>(ros2Topic: Ros2Topic<Message>): RomiTopic<Message> {
    return {
      ...ros2Topic,
      validate: (msg) => msg,
    };
  }

  toRomiService<Request = unknown, Response = unknown>(
    ros2Service: Ros2Service<Request, Response>,
  ): RomiService<Request, Response> {
    return {
      ...ros2Service,
      validateRequest: (msg) => msg,
      validateResponse: (msg) => msg,
    };
  }

  private _subscriptions: Record<number, SubscriptionRecord> = {};
  private _innerSubscriptions: SubscriptionRecord[] = [];
  private _publishers: Record<number, PublisherRecord> = {};
  private _innerPublishers: PublisherRecord[] = [];
  private _idCounter = 0;

  private _removeInnerHandler(id: number) {
    const record = this._subscriptions[id];
    if (record) {
      delete record.callbacks[id];
      this._logger.info('removed inner subscription handler', { id, topic: record.topic.topic });
      delete this._subscriptions[id];
      this._logger.info('removed subscription', { id, topic: record.topic.topic });
    }
  }
}
