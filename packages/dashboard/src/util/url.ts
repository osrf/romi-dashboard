/**
 * Normalizes a path so that it:
 *   * starts with a '/'
 *   * never ends with '/', unless it is '/'
 *   * does not have repeated forward slashes
 * @param pathOrUrl if an url is provided, returns only the normalized path portion of the url
 */
export function normalizePath(pathOrUrl: string) {
  let path = pathOrUrl.startsWith('http') ? new URL(pathOrUrl).pathname : pathOrUrl;
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

export const BASE_PATH = normalizePath(process.env.PUBLIC_URL || '/');

/**
 * Resolves a relative to the normalized full path.
 * @param path must be in a format accepted by `normalizePath`
 * @param basePath must be in a format accepted by `normalizePath`
 */
export function getFullPath(path: string, basePath = BASE_PATH): string {
  return normalizePath(`${basePath}/${path}`);
}

/**
 * Get a qualified url based on the path. The schema and hostname is obtained based on the
 * current `window.location`.
 */
export function getUrl(path: string): string {
  return `${window.location.origin}${normalizePath(path)}`;
}

export const DASHBOARD_ROUTE = BASE_PATH;
export const LOGIN_ROUTE = normalizePath(`${BASE_PATH}/login`);
export const MOSAIC_ROUTE = normalizePath(`${BASE_PATH}/mosaic`);
