import Debug from 'debug';
import EventEmitter from 'eventemitter3';
import Keycloak_, { KeycloakInstance } from 'keycloak-js';
import { BASE_PATH, getUrl } from '../../util/url';
import Authenticator, { AuthConfig, AuthenticatorEventType } from './authenticator';
import { User } from './user';

const debug = Debug('authenticator');

export default class KeycloakAuthenticator
  extends EventEmitter<AuthenticatorEventType>
  implements Authenticator {
  get user(): User | undefined {
    return this._user;
  }

  get token(): string | undefined {
    return this._inst.idToken;
  }

  constructor(config: AuthConfig, redirectUri?: string) {
    super();
    this._inst = Keycloak_(config);
    this._redirectUri = redirectUri;
  }

  async init() {
    if (this._initialized) {
      debug('already initialized');
      return;
    }

    debug('initializing authenticator');

    this._inst.onAuthSuccess = async () => {
      this._user = {
        username: (this._inst.idTokenParsed as any).preferred_username,
      };
      debug('authenticated as', this._user.username);
      this.emit('userChanged', this._user);
    };

    this._inst.onAuthLogout = () => {
      debug('logout');
      this._user = undefined;
      this.emit('userChanged', null);
    };

    await this._inst.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: getUrl(`${BASE_PATH}/silent-check-sso.html`),
      redirectUri: this._redirectUri,
    });
    try {
      const refreshed = await this._inst.updateToken(30);
      refreshed && debug('token refreshed');
    } catch {}

    this._user = this._inst.idTokenParsed && {
      username: (this._inst.idTokenParsed as any).preferred_username,
    };
    this._initialized = true;
  }

  async login(successRedirectUri: string): Promise<never> {
    await this._inst.login({
      redirectUri: successRedirectUri,
    });
    throw new Error('should not reach here');
  }

  async logout(): Promise<never> {
    await this._inst.logout();
    throw new Error('should not reach here');
  }

  private _initialized = false;
  private _inst: KeycloakInstance;
  private _redirectUri?: string;
  private _user?: User;
}
