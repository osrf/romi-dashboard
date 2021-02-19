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

  test('return the normalized path portion when given a url', () => {
    expect(normalizePath('http://test.com/foo')).toBe('/foo');
  });

  test('return "/" when url does not contain path portion', () => {
    expect(normalizePath('http://test.com')).toBe('/');
  });

  test('return normalized path when url contains fragment', () => {
    expect(normalizePath('http://test.com/foo#fragment')).toBe('/foo');
  });

  test('return normalized path when url contains query', () => {
    expect(normalizePath('http://test.com/foo?query=hello')).toBe('/foo');
  });
});

describe('getFullPath', () => {
  test('basic tests', () => {
    expect(getFullPath('some/path', '/')).toBe('/some/path');
    expect(getFullPath('other/path', 'some/path')).toBe('/some/path/other/path');
  });
});
