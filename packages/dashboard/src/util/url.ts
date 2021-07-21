import { normalizePath } from 'rmf-auth';

export const BASE_PATH = normalizePath(process.env.PUBLIC_URL || '/');
export const DASHBOARD_ROUTE = BASE_PATH;
export const LOGIN_ROUTE = normalizePath(`${BASE_PATH}/login`);
export const TASKS_ROUTE = normalizePath(`${BASE_PATH}/tasks`);
export const ROBOTS_ROUTE = normalizePath(`${BASE_PATH}/robots`);
export const ADMIN_ROUTE = normalizePath(`${BASE_PATH}/admin`);
