import EventEmitter from 'eventemitter3';
import Authenticator, { AuthenticatorEventType } from './authenticator';
import { User } from './user';

export default class StubAuthenticator
  extends EventEmitter<AuthenticatorEventType>
  implements Authenticator {
  readonly user: User = {
    username: 'stub',
  };

  readonly token?: string = undefined;

  init(): Promise<void> {
    return Promise.resolve();
  }

  login(): Promise<never> {
    throw new Error('not supported');
  }

  logout(): Promise<never> {
    throw new Error('not supported');
  }
}
