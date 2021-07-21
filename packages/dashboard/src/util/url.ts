import { normalizePath } from 'rmf-auth';

export const BasePath = normalizePath(process.env.PUBLIC_URL || '/');
export const DashboardRoute = BasePath;
export const LoginRoute = normalizePath(`${BasePath}/login`);
export const TasksRoute = normalizePath(`${BasePath}/tasks`);
export const RobotsRoute = normalizePath(`${BasePath}/robots`);
export const AdminRoute = normalizePath(`${BasePath}/admin`);
