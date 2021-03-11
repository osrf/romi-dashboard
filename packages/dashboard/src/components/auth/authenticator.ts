import EventEmitter from 'eventemitter3';
import Keycloak_ from 'keycloak-js';
import { User } from './user';

export type AuthenticatorEventType = {
  userChanged: [User | null];
};

export default interface Authenticator extends EventEmitter<AuthenticatorEventType> {
  readonly user?: User;
  readonly token?: string;

  /**
   * It is required to call this before using any of the authenticator functions.
   */
  init(): Promise<void>;

  /**
   * Note: This redirects to external login page so it will never return.
   * @param successRedirectUri The uri to redirect to after a successful login
   */
  login(successRedirectUri: string): Promise<never>;

  /**
   * Note: This redirects to external logout page so it will never return.
   */
  logout(): Promise<never>;
}

export type AuthConfig<T = typeof Keycloak_> = T extends (config: infer U) => unknown ? U : never;
