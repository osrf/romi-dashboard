import { SioClient, Subscription, TaskProgress } from 'api-client';
import React from 'react';
import { FleetStateContext } from '../rmf-app';
import * as RmfModels from 'rmf-models';
import { VerboseRobot } from 'react-components';
import { allocateTasksToRobots, getTasksProgress } from './utils';

export interface AutoRefreshState {
  verboseRobots: VerboseRobot[];
  enabled: boolean;
}

export interface AutoRefreshDispatcher {
  setVerboseRobots: React.Dispatch<React.SetStateAction<VerboseRobot[]>>;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RobotStore extends RmfModels.RobotState {
  fleetName: string;
}

export function useAutoRefresh(
  sioClient?: SioClient,
  initalRobots: VerboseRobot[] | (() => VerboseRobot[]) = [],
  initialAutoRefresh: boolean | (() => boolean) = true,
): [AutoRefreshState, AutoRefreshDispatcher] {
  const [tasks, setTasks] = React.useState<TaskProgress[]>([]);
  const [taskIds, setTaskIds] = React.useState<string[]>(() =>
    tasks.map((t) => t.task_summary.task_id),
  );
  const [robots, setRobots] = React.useState<RobotStore[]>([]);
  const [enabled, setEnabled] = React.useState(initialAutoRefresh);
  const [verboseRobots, setVerboseRobots] = React.useState<VerboseRobot[]>(initalRobots);
  const fleets = React.useContext(FleetStateContext);

  React.useEffect(() => {
    const robotStore: RobotStore[] = [];
    const fleetName = Object.keys(fleets);
    fleetName.forEach((name: string) => {
      fleets[name].robots.forEach((robot) => {
        const r: RobotStore = { ...robot, fleetName: name };
        robotStore.push(r);
      });
    });
    setRobots(robotStore);
  }, [fleets]);

  React.useEffect(() => {
    if (!enabled || !sioClient) {
      return;
    }
    const subscriptions: Subscription[] = [];
    taskIds.forEach((taskId, idx) => {
      subscriptions.push(
        sioClient.subscribeTaskProgress(taskId, (newTask) => {
          let taskProgressConverter: TaskProgress;
          // initialize task progress if task summary is returned
          if (!newTask.task_summary)
            taskProgressConverter = { task_summary: newTask, progress: '0%' };
          else {
            taskProgressConverter = newTask;
          }
          setTasks((prev) => [
            ...prev.slice(0, idx),
            taskProgressConverter,
            ...prev.slice(idx + 1),
          ]);
        }),
      );
    });
  }, [enabled, sioClient, taskIds]);

  // combine all robots and tasks and sort them
  React.useEffect(() => {
    if (enabled && robots && tasks) {
      setVerboseRobots(allocateTasksToRobots(robots, tasks));
    }
  }, [enabled, tasks, robots]);

  const autoRefreshState = React.useMemo(() => ({ verboseRobots, enabled }), [
    verboseRobots,
    enabled,
  ]);
  const autoRefreshDispatcher = React.useMemo<AutoRefreshDispatcher>(
    () => ({
      setEnabled,
      setVerboseRobots: (value) => {
        if (typeof value === 'function') {
          setVerboseRobots((prev) => {
            const newRobots = value(prev);
            const tasks = getTasksProgress(newRobots);
            setTasks(tasks);
            setTaskIds(tasks.map((t) => t.task_summary.task_id));
            return newRobots;
          });
        } else {
          const newRobots = value;
          const tasks = getTasksProgress(newRobots);
          setTasks(tasks);
          setTaskIds(tasks.map((t) => t.task_summary.task_id));
          setVerboseRobots(newRobots);
        }
      },
    }),
    [],
  );

  return [autoRefreshState, autoRefreshDispatcher];
}
