import { Task } from 'api-client';
import * as RmfModels from 'rmf-models';

export function makeTaskSummary(
  id: string,
  numberOfPhases: number,
  currentPhase: number,
): RmfModels.TaskSummary {
  let status = '';
  for (let i = 0; i < numberOfPhases; i++) {
    if (currentPhase === i + 1) {
      status += '*';
    }
    status += `Phase ${i + 1}\ntest phase ${i + 1}\n\n`;
  }
  status = status.trimEnd();
  return new RmfModels.TaskSummary({
    task_id: id,
    start_time: { sec: 0, nanosec: 0 },
    end_time: { sec: 0, nanosec: 0 },
    submission_time: { sec: 0, nanosec: 0 },
    state: RmfModels.TaskSummary.STATE_ACTIVE,
    status: status,
    fleet_name: 'test_fleet',
    robot_name: 'test_robot',
  });
}

export function makeTask(taskId: string, numberOfPhases: number, currentPhase: number): Task {
  const taskSummary = makeTaskSummary(taskId, numberOfPhases, currentPhase);
  return {
    task_id: taskId,
    authz_grp: 'test_group',
    progress: '',
    summary: taskSummary,
  };
}
