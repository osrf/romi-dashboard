import type { SubmitTask, Task } from 'api-client';
import * as RmfModels from 'rmf-models';

export function makeTask(
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

export function makeSubmitTask(): SubmitTask {
  return {
    description: {
      cleaning_zone: 'zone',
    },
    start_time: Math.floor(Date.now() / 1000),
    task_type: RmfModels.TaskType.TYPE_CLEAN,
    priority: 0,
  };
}

export function makeDefinedTask(
  type: string,
  robotName: string,
  id: string,
  numberOfPhases: number,
  currentPhase: number,
): Task {
  let status = '';
  for (let i = 0; i < numberOfPhases; i++) {
    if (currentPhase === i + 1) {
      status += '*';
    }
    status += `Phase ${i + 1}\ntest phase ${i + 1}\n\n`;
  }
  status = status.trimEnd();

  const loop = new RmfModels.Loop({
    task_id: id,
    robot_type: 'test_robot',
    num_loops: 1,
    start_name: 'loop_location_1',
    finish_name: 'loop_location_2',
  });

  const loopTask = new RmfModels.TaskDescription({
    start_time: { sec: 0, nanosec: 0 },
    priority: { value: 0 },
    task_type: { type: 1 },
    loop: loop,
  });

  const delivery = new RmfModels.Delivery({
    task_id: id,
    items: [],
    pickup_place_name: 'pickup_1',
    pickup_dispenser: 'pickup_dispenser',
    dropoff_place_name: 'dropoff_1',
    dropoff_ingestor: 'dropoff_ingesstor',
  });

  const deliveryTask = new RmfModels.TaskDescription({
    start_time: { sec: 0, nanosec: 0 },
    priority: { value: 0 },
    task_type: { type: 2 },
    delivery: delivery,
  });

  const clean = new RmfModels.Clean({
    start_waypoint: 'cleaning_zone',
  });

  const cleaningTask = new RmfModels.TaskDescription({
    start_time: { sec: 0, nanosec: 0 },
    priority: { value: 0 },
    task_type: { type: 4 },
    clean: clean,
  });

  function checkType() {
    switch (type) {
      case 'Delivery':
        return deliveryTask;

      case 'Loop':
        return loopTask;

      case 'Clean':
        return cleaningTask;

      default:
        return loopTask;
    }
  }

  const taskSummary = new RmfModels.TaskSummary({
    task_id: id,
    task_profile: {
      task_id: id,
      submission_time: { sec: 0, nanosec: 0 },
      description: checkType(),
    },
    start_time: { sec: 0, nanosec: 0 },
    end_time: { sec: 0, nanosec: 0 },
    submission_time: { sec: 0, nanosec: 0 },
    state: RmfModels.TaskSummary.STATE_ACTIVE,
    status: status,
    fleet_name: 'test_fleet',
    robot_name: robotName,
  });

  const progress = Math.floor(Math.random() * 100);

  return { task_id: id, authz_grp: 'test_group', summary: taskSummary, progress: progress };
}
