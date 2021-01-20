import ResourceManager from '../managers/resource-manager';
import fakeResources from '../mock/data/resources';

describe('Correct instantiation', () => {
  test('Instantiate robots and dispensers', () => {
    const resources = ResourceManager.resourceManagerFactory(fakeResources());
    expect(!!resources.robots).toBe(true);
    expect(!!resources.dispensers).toBe(true);
  });

  test(`Instantiate just robots`, () => {
    const rawResources = { robots: fakeResources().robots, dispensers: {} };
    const resources = ResourceManager.resourceManagerFactory(rawResources);
    expect(!!resources.robots).toBe(true);
    expect(resources.dispensers).toBe(undefined);
  });
});
