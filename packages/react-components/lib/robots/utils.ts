import type { Task } from 'api-client';
import * as RmfModels from 'rmf-models';

/**
 * Returns a uniquely identifiable string representing a robot.
 */
export function robotHash(name: string, fleet: string): string {
  return `${name}__${fleet}`;
}

export function robotModeToString(robotMode: RmfModels.RobotMode): string {
  switch (robotMode.mode) {
    case RmfModels.RobotMode.MODE_CHARGING:
      return 'Charging';
    case RmfModels.RobotMode.MODE_DOCKING:
      return 'Docking';
    case RmfModels.RobotMode.MODE_EMERGENCY:
      return 'Emergency';
    case RmfModels.RobotMode.MODE_GOING_HOME:
      return 'Going Home';
    case RmfModels.RobotMode.MODE_IDLE:
      return 'Idle';
    case RmfModels.RobotMode.MODE_MOVING:
      return 'Moving';
    case RmfModels.RobotMode.MODE_PAUSED:
      return 'Paused';
    case RmfModels.RobotMode.MODE_WAITING:
      return 'Waiting';
    default:
      return `Unknown (${robotMode.mode})`;
  }
}

export interface VerboseRobot {
  fleet: string;
  name: string;
  state: RmfModels.RobotState;
  tasks: Task[];
}
