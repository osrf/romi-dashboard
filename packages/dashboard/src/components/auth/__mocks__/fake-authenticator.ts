import EventEmitter from 'eventemitter3';
import { Authenticator, AuthenticatorEventType } from 'rmf-auth';

export class FakeAuthenticator
  extends EventEmitter<AuthenticatorEventType>
  implements Authenticator {
  user?: string;

  constructor(user?: string) {
    super();
    this.user = user;
  }

  async init(): Promise<void> {
    // It is required to call this before using any of the authenticator functions.
  }

  login(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  logout(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  refreshToken(): Promise<void> {
    return Promise.resolve();
  }
}

export default FakeAuthenticator;
