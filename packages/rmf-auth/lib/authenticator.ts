import EventEmitter from 'eventemitter3';

export type AuthenticatorEventType = {
  userChanged: [string | null];
  tokenRefresh: null;
};

export interface Authenticator extends EventEmitter<AuthenticatorEventType> {
  readonly user?: string;
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

  /**
   * Called before each request that requires a token
   */
  refreshToken(): Promise<void>;
}

export default Authenticator;
