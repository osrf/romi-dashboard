import { TaskProgress } from 'api-client';
import * as RmfModels from 'rmf-models';
import { VerboseRobot, rosTimeToJs } from 'react-components';

export interface RobotStore extends RmfModels.RobotState {
  fleetName: string;
}

function compareTime(a: TaskProgress, b: TaskProgress): number {
  const aTime = rosTimeToJs(a.task_summary.start_time);
  const bTime = rosTimeToJs(b.task_summary.start_time);
  return aTime.getTime() - bTime.getTime();
}

function sortTaskByStartTime(tasks: TaskProgress[]): TaskProgress[] {
  return tasks.sort(compareTime);
}

export function makeVerboseRobot(robot: RobotStore, assignedTasks: TaskProgress[]): VerboseRobot {
  return {
    fleet: robot.fleetName,
    name: robot.name,
    state: { ...robot },
    tasks: sortTaskByStartTime(assignedTasks),
  };
}

export function allocateTasksToRobots(robots: RobotStore[], tasks: TaskProgress[]): VerboseRobot[] {
  const removableTaskStates = [
    RmfModels.TaskSummary.STATE_ACTIVE,
    RmfModels.TaskSummary.STATE_PENDING,
    RmfModels.TaskSummary.STATE_QUEUED,
  ];
  const robotsWithAssignedTasks = robots.map((robot) => {
    const assignedTasks = tasks.filter((task) => {
      if (
        task.task_summary.robot_name === robot.name &&
        removableTaskStates.indexOf(task.task_summary.state) !== -1
      ) {
        return task;
      }
      return false;
    });
    return makeVerboseRobot(robot, assignedTasks);
  });
  return robotsWithAssignedTasks;
}

export const getTasksProgress = (verboseRobots: VerboseRobot[]): TaskProgress[] => {
  const tasks: TaskProgress[] = [];
  verboseRobots.forEach((robot) => {
    tasks.push(...robot.tasks);
  });
  return tasks;
};
