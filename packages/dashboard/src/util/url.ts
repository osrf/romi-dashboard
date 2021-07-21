export const BasePath = process.env.PUBLIC_URL || '/';
export const DashboardRoute = BasePath === '/' ? '' : BasePath;
export const LoginRoute = `${BasePath}login`;
export const TasksRoute = `${BasePath}tasks`;
export const RobotsRoute = `${BasePath}robots`;
export const AdminRoute = `${BasePath}admin`;
