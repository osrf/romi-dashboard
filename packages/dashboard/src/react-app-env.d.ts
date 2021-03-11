/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_TRAJECTORY_SERVER?: string;
    readonly REACT_APP_AUTH_PROVIDER?: string;
    readonly REACT_APP_KEYCLOAK_CONFIG?: string;
    readonly REACT_APP_ROS2_BRIDGE_SERVER?: string;
    readonly PUBLIC_URL?: string;
  }
}
