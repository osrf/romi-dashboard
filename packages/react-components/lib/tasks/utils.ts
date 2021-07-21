import * as RmfModels from 'rmf-models';

export function taskStateToStr(state: number): string {
  switch (state) {
    case RmfModels.TaskSummary.STATE_ACTIVE:
      return 'Active';
    case RmfModels.TaskSummary.STATE_CANCELED:
      return 'Cancelled';
    case RmfModels.TaskSummary.STATE_COMPLETED:
      return 'Completed';
    case RmfModels.TaskSummary.STATE_FAILED:
      return 'Failed';
    case RmfModels.TaskSummary.STATE_PENDING:
      return 'Pending';
    case RmfModels.TaskSummary.STATE_QUEUED:
      return 'Queued';
    default:
      return 'Unknown';
  }
}

export function taskTypeToStr(taskType: number): string {
  switch (taskType) {
    case RmfModels.TaskType.TYPE_CHARGE_BATTERY:
      return 'Charge';
    case RmfModels.TaskType.TYPE_CLEAN:
      return 'Clean';
    case RmfModels.TaskType.TYPE_DELIVERY:
      return 'Delivery';
    case RmfModels.TaskType.TYPE_LOOP:
      return 'Loop';
    case RmfModels.TaskType.TYPE_PATROL:
      return 'Patrol';
    case RmfModels.TaskType.TYPE_STATION:
      return 'Station';
    default:
      return 'Unknown';
  }
}
