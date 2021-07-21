import EventEmitter from 'eventemitter3';
import { Authenticator, AuthenticatorEventType } from './authenticator';

export default class StubAuthenticator
  extends EventEmitter<AuthenticatorEventType>
  implements Authenticator {
  readonly user = 'stub';

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

  refreshToken(): Promise<void> {
    return Promise.resolve();
  }
}
