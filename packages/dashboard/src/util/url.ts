/**
 * Normalizes a path so that it always starts with a '/', never ends with '/', unless it is '/'.
 */
export function normalizePath(path: string) {
  while (path.indexOf('//') !== -1) {
    path = path.replace(/\/\//g, '/');
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, path.length - 1);
  }
  return path;
}

/**
 * Normalized base path.
 */
export const BASE_PATH = normalizePath(process.env.REACT_APP_BASE_PATH || '/');

/**
 * Resolves a relative to the normalized full path.
 * @param path relative path, should not start with '/'.
 * @param basePath must be a normalized path.
 */
export function getFullPath(path: string, basePath = BASE_PATH): string {
  return normalizePath(`${basePath}/${path}`);
}

export const LOGIN_ROUTE = getFullPath('login');
export const GRID_ROUTE = getFullPath('grid');
