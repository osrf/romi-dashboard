import {
  Configuration,
  DispensersApi,
  DoorsApi,
  FleetsApi,
  IngestorsApi,
  LiftsApi,
  SioClient,
  TasksApi,
} from 'api-client';
import axios from 'axios';
import { Authenticator } from 'rmf-auth';
import appConfig from '../../app-config';
import { NegotiationStatusManager } from '../../managers/negotiation-status-manager';
import { RobotTrajectoryManager } from '../../managers/robot-trajectory-manager';

export class RmfIngress {
  sioClient: SioClient;
  doorsApi: DoorsApi;
  liftsApi: LiftsApi;
  dispensersApi: DispensersApi;
  ingestorsApi: IngestorsApi;
  fleetsApi: FleetsApi;
  tasksApi: TasksApi;
  negotiationStatusManager: NegotiationStatusManager;
  trajectoryManager?: RobotTrajectoryManager;

  constructor(authenticator: Authenticator, trajMgr?: RobotTrajectoryManager, ws?: WebSocket) {
    this.negotiationStatusManager = new NegotiationStatusManager(ws, appConfig.authenticator);
    this.sioClient = (() => {
      const token = appConfig.authenticator.token;
      const url = new URL(appConfig.rmfServerUrl);
      const path = url.pathname === '/' ? '' : url.pathname;

      const options: ConstructorParameters<typeof SioClient>[1] = {
        path: `${path}/socket.io`,
      };
      if (token) {
        options.auth = { token };
      }
      return new SioClient(url.origin, options);
    })();
    this.sioClient.sio.on('error', console.error);

    // the axios swagger generator is bugged, it does not properly attach the token so we have
    // to manually add them.
    const axiosInst = axios.create();
    axiosInst.interceptors.request.use(async (req) => {
      await authenticator.refreshToken();
      const token = authenticator.token;
      if (!token) {
        return req;
      }
      req.headers['Authorization'] = `Bearer ${token}`;
      return req;
    });
    const apiConfig: Configuration = {
      accessToken: authenticator.user?.token,
      basePath: appConfig.rmfServerUrl,
    };

    this.doorsApi = new DoorsApi(apiConfig, undefined, axiosInst);
    this.liftsApi = new LiftsApi(apiConfig, undefined, axiosInst);
    this.dispensersApi = new DispensersApi(apiConfig, undefined, axiosInst);
    this.ingestorsApi = new IngestorsApi(apiConfig, undefined, axiosInst);
    this.fleetsApi = new FleetsApi(apiConfig, undefined, axiosInst);
    this.tasksApi = new TasksApi(apiConfig, undefined, axiosInst);
    this.trajectoryManager = trajMgr;
  }
}
