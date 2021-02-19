import Debug from 'debug';
import {
  RobotTrajectoryManager,
  TimeRequest,
  TimeResponse,
  TrajectoryRequest,
  TrajectoryResponse,
} from '../robot-trajectory-manager';
import trajectories from './trajectories.json';

const debug = Debug('FakeTrajectoryManager');

export default class FakeTrajectoryManager implements RobotTrajectoryManager {
  async latestTrajectory(request: TrajectoryRequest): Promise<TrajectoryResponse> {
    debug('sending trajectory');
    if (request.param.map_name === 'L1') {
      const traj = trajectories[this.currentTraj++];
      this.currentTraj %= trajectories.length;
      // "deep clone" object
      return JSON.parse(JSON.stringify(traj)) as any;
    }

    return {
      response: 'trajectory',
      values: [],
      conflicts: [],
    };
  }

  serverTime(request: TimeRequest): Promise<TimeResponse> {
    throw new Error('Method not implemented.');
  }

  private currentTraj = 0;
}
