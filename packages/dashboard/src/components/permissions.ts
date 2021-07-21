import { Task } from 'api-client';
import { User } from './auth/contexts';

export enum RmfAction {
  TaskRead = 'task_read',
  TaskSubmit = 'task_submit',
  TaskCancel = 'task_cancel',
}

export function getActionText(action: RmfAction): string {
  return action.replace(/(?:^|_)([a-z])/g, (_, p1: string) => ` ${p1.toUpperCase()}`).slice(1);
}

export class Enforcer {
  static canCancelTask(user: User, task: Task): boolean {
    if (user.profile.is_admin) {
      return true;
    }
    for (const p of user.permissions) {
      if (p.authz_grp === task.authz_grp && p.action === RmfAction.TaskCancel) {
        return true;
      }
    }
    return false;
  }
}
