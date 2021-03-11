import { ColorManager } from '../lib';

let colorManager: ColorManager;

beforeEach(() => {
  colorManager = new ColorManager();
});

it('snapshot - get color based on image', async () => {
  const color = await colorManager.robotPrimaryColor(
    'test_fleet',
    'test_robot',
    'test_model',
    '/base/tests/assets/tiny-robot.png',
  );
  const values = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')'));
  const rgb = values.split(',').map((v) => parseInt(v));
  expect(Math.abs(rgb[0] - 4)).toBeLessThanOrEqual(2);
  expect(Math.abs(rgb[1] - 52)).toBeLessThanOrEqual(2);
  expect(Math.abs(rgb[2] - 156)).toBeLessThanOrEqual(2);
});

it('able to get color from cache after the color is loaded previously', async () => {
  const color = await colorManager.robotPrimaryColor('test_fleet', 'test_robot', 'test_model');
  const colorCache = colorManager.robotColorFromCache('test_fleet', 'test_robot');
  expect(colorCache).toBe(color);
});

it('fallback to color from id if image analysis fails', async () => {
  expect(async () => {
    await colorManager.robotPrimaryColor(
      'test_fleet',
      'test_robot',
      'test_model',
      '/non-existing-image.png',
    );
  }).not.toThrow();
});
