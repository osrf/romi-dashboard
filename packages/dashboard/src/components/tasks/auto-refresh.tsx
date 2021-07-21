import { SioClient, Subscription, Task } from 'api-client';
import React from 'react';

export interface AutoRefreshState {
  tasks: Task[];
  enabled: boolean;
}

export interface AutoRefreshDispatcher {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Helper hook to implement auto refresh feature of for task summaries. This helps to manage the
 * tasks list state so that task events are only subscribed for the current list of tasks, and no
 * extra subscribe/unsubscribe are made when a new task update comes in.
 *
 * task summaries event for a task is subscribed when:
 *   1. auto refresh is enabled.
 *   2. task is in the current set of tracked tasks.
 *
 * When the task list is change via the `setTasks` dispatch function, all current subscriptions are
 * unsubscribed and the new tasks are subscribed.
 */
export function useAutoRefresh(
  sioClient?: SioClient,
  initalTasks: Task[] | (() => Task[]) = [],
  initialAutoRefresh: boolean | (() => boolean) = true,
): [AutoRefreshState, AutoRefreshDispatcher] {
  //TODO: See if it is possible to refactor this to be item agnostic, so it can be used for other components.

  const [tasks, setTasks] = React.useState<Task[]>(initalTasks);
  const [taskIds, setTaskIds] = React.useState<string[]>(() => tasks.map((t) => t.task_id));
  const [enabled, setEnabled] = React.useState(initialAutoRefresh);

  React.useEffect(() => {
    if (!enabled || !sioClient) {
      return;
    }

    const subscriptions: Subscription[] = [];

    taskIds.forEach((taskId, idx) => {
      subscriptions.push(
        sioClient.subscribeTaskSummary(taskId, (newTask) =>
          setTasks((prev) => {
            prev[idx].summary = newTask;
            return [...prev];
          }),
        ),
      );
    });

    return () => {
      subscriptions.forEach((s) => sioClient.unsubscribe(s));
    };
  }, [enabled, sioClient, taskIds]);

  const autoRefreshState = React.useMemo(() => ({ tasks, enabled }), [tasks, enabled]);
  const autoRefreshDispatcher = React.useMemo<AutoRefreshDispatcher>(
    () => ({
      setEnabled,
      setTasks: (value) => {
        if (typeof value === 'function') {
          setTasks((prev) => {
            const newTasks = value(prev);
            setTaskIds(newTasks.map((t) => t.task_id));
            return newTasks;
          });
        } else {
          const newTasks = value;
          setTaskIds(newTasks.map((t) => t.task_id));
          setTasks(newTasks);
        }
      },
    }),
    [],
  );

  return [autoRefreshState, autoRefreshDispatcher];
}
