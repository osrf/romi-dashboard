import EventEmitter from 'eventemitter3';
import Authenticator, { AuthenticatorEventType } from '../authenticator';
import { User } from '../user';

export default class FakeAuthenticator
  extends EventEmitter<AuthenticatorEventType>
  implements Authenticator {
  user?: User;

  constructor(user?: User) {
    super();
    this.user = user;
  }

  async init(): Promise<void> {}

  login(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  logout(): Promise<never> {
    throw new Error('Method not implemented.');
  }
}
