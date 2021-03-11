import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Authenticator from './components/auth/authenticator';
import KeycloakAuthenticator from './components/auth/keycloak';
import StubAuthenticator from './components/auth/stub';
import ResourceManager from './managers/resource-manager';
import {
  DefaultTrajectoryManager,
  RobotTrajectoryManager,
} from './managers/robot-trajectory-manager';
import Ros2Transport from './ros2-transport';
import RpcClient from './rpc-client';

export interface AppConfig {
  authenticator: Authenticator;
  transportFactory: () => Promise<RomiCore.Transport>;
  trajectoryManagerFactory?: () => Promise<RobotTrajectoryManager>;
  trajServerUrl: string;
  appResourcesFactory: () => Promise<ResourceManager | undefined>;
}

export const appConfig: AppConfig = (() => {
  const trajServer = process.env.REACT_APP_TRAJECTORY_SERVER;
  if (!trajServer) {
    throw new Error('REACT_APP_TRAJECTORY_SERVER env variable is needed but not defined');
  }

  const authenticator = (() => {
    if (!process.env.REACT_APP_AUTH_PROVIDER) {
      return new StubAuthenticator();
    }
    // it is important that we do not do any processing on REACT_APP_AUTH_PROVIDER so that webpack
    // can remove dead code, we DO NOT want the output to have the stub authenticator even if
    // it is not used.
    const provider = process.env.REACT_APP_AUTH_PROVIDER;
    switch (provider) {
      case 'keycloak':
        if (!process.env.REACT_APP_KEYCLOAK_CONFIG) {
          throw new Error('missing REACT_APP_KEYCLOAK_CONFIG');
        }
        return new KeycloakAuthenticator(JSON.parse(process.env.REACT_APP_KEYCLOAK_CONFIG));
      case 'stub':
        return new StubAuthenticator();
      default:
        throw new Error(`unknown auth provider "${provider}"`);
    }
  })();

  if (!process.env.REACT_APP_ROS2_BRIDGE_SERVER) {
    throw new Error('REACT_APP_ROS2_BRIDGE_SERVER env variable is needed but not defined');
  }
  const ros2BridgeServer = process.env.REACT_APP_ROS2_BRIDGE_SERVER;
  let ros2BridgeClientPromise: Promise<RpcClient> | undefined;
  const getRos2BridgeClientPromise = () => {
    if (!ros2BridgeClientPromise) {
      ros2BridgeClientPromise = RpcClient.connect(ros2BridgeServer, authenticator.token);
    }
    return ros2BridgeClientPromise;
  };

  return {
    authenticator,
    appResourcesFactory: ResourceManager.getResourceConfigurationFile,
    trajectoryManagerFactory: () => DefaultTrajectoryManager.create(trajServer),
    transportFactory: async () => {
      const ros2BridgeClient = await getRos2BridgeClientPromise();
      return new Ros2Transport(ros2BridgeClient);
    },
    trajServerUrl: trajServer,
  };
})();

export default appConfig;
