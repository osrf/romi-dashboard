import { getFullPath, normalizePath } from '../url';

describe('normalizePath', () => {
  test('normalize "" to "/"', () => {
    expect(normalizePath('')).toBe('/');
  });

  test('adds leading slash', () => {
    expect(normalizePath('some/path')).toBe('/some/path');
  });

  test('removes trailing slash', () => {
    expect(normalizePath('/some/path/')).toBe('/some/path');
  });

  test('removes repeated forward slashes', () => {
    expect(normalizePath('/some//path')).toBe('/some/path');
  });

  test('removes repeated forward slashes', () => {
    expect(normalizePath('/some///path//////other/path')).toBe('/some/path/other/path');
  });

  test('all at once', () => {
    expect(normalizePath('some//path/other/////path///')).toBe('/some/path/other/path');
  });
});

describe('getFullPath', () => {
  test('basic tests', () => {
    expect(getFullPath('some/path', '/')).toBe('/some/path');
    expect(getFullPath('other/path', 'some/path')).toBe('/some/path/other/path');
  });
});
