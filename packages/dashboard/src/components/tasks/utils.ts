import { SubmitTask } from 'api-client';
import * as RmfModels from 'rmf-models';

/* istanbul ignore next */
function checkField(obj: Record<string, unknown>, field: string, type: string): void {
  if (!Object.prototype.hasOwnProperty.call(obj, field) || typeof obj[field] !== type) {
    throw new TypeError(`expected [${field}] to be [${type}]`);
  }
}

// TODO: See if we can generate validators from the schema.
/* istanbul ignore next */
export function parseTasksFile(contents: string): SubmitTask[] {
  const tasks = JSON.parse(contents);
  if (!Array.isArray(tasks)) {
    throw new TypeError('expected an array');
  }
  for (const t of tasks) {
    if (typeof t !== 'object') {
      throw new TypeError('expected object');
    }
    checkField(t, 'task_type', 'number');
    checkField(t, 'start_time', 'number');
    checkField(t, 'priority', 'number');
    checkField(t, 'description', 'object');
    const desc = t['description'];
    switch (t['task_type']) {
      case RmfModels.TaskType.TYPE_CLEAN:
        checkField(desc, 'cleaning_zone', 'string');
        break;
      case RmfModels.TaskType.TYPE_DELIVERY:
        checkField(desc, 'pickup_place_name', 'string');
        checkField(desc, 'pickup_dispenser', 'string');
        checkField(desc, 'dropoff_ingestor', 'string');
        checkField(desc, 'dropoff_place_name', 'string');
        break;
      case RmfModels.TaskType.TYPE_LOOP:
        checkField(desc, 'num_loops', 'number');
        checkField(desc, 'start_name', 'string');
        checkField(desc, 'finish_name', 'string');
        break;
      default:
        throw new TypeError('unknown task_type');
    }
  }
  return tasks;
}
