import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { KeycloakConfig } from 'keycloak-js';
import Authenticator, { DefaultAuthenticator } from './components/auth/authenticator';
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

  const authConfig: KeycloakConfig = (() => {
    if (!process.env.REACT_APP_AUTH_CONFIG) {
      throw new Error('REACT_APP_AUTH_CONFIG env variable is needed but not defined');
    }
    return JSON.parse(process.env.REACT_APP_AUTH_CONFIG);
  })();
  const authenticator = new DefaultAuthenticator(authConfig);

  if (!process.env.REACT_APP_ROS2_BRIDGE_SERVER) {
    throw new Error('REACT_APP_ROS2_BRIDGE_SERVER env variable is needed but not defined');
  }
  const ros2BridgeServer = process.env.REACT_APP_ROS2_BRIDGE_SERVER;
  let ros2BridgeClientPromise: Promise<RpcClient> | undefined;
  const getRos2BridgeClientPromise = () => {
    if (!authenticator.token) {
      throw new Error('no authentication token available');
    }
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
