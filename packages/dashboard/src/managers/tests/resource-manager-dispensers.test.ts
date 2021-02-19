import { DispenserResource, DispenserResourceManager } from '../resource-manager-dispensers';
import fakeResources from '../__mocks__/resources';

describe('The correct operation of the getIconPath method of the DispenserResourceManager class', () => {
  let manager: DispenserResourceManager;
  let resourceData: Record<string, DispenserResource>;

  beforeAll(() => {
    resourceData = fakeResources().dispensers as Record<string, DispenserResource>;
    manager = new DispenserResourceManager(resourceData);
  });

  test('Returns falsy when dispenserName does not exist', () => {
    const icon = manager.getIconPath('Not exists');
    expect(icon).toBeFalsy();
  });

  test('Returns falsy if the icon path it`s empty', () => {
    resourceData.testDispenser = {
      guid: 'testDispenser',
      icons: {
        testDispenser: '',
      },
      location: { x: 1, y: 1, yaw: 1, level_name: 'L1' },
    };
    const icon = manager.getIconPath('testDispenser');
    expect(icon).toBeFalsy();
  });

  test('Returns trusty if the icon path exists', () => {
    const dispenserName = Object.keys(resourceData)[0]; // coke_ingestor
    resourceData[dispenserName].icons[dispenserName] = '/dispenser';
    const icon = manager.getIconPath(dispenserName);
    expect(icon).toBeTruthy();
  });
});

describe('The correct operation of the getters of the DispenserResourceManager class', () => {
  test('Gets all dispensers with the `all` getter', () => {
    const resourceData = fakeResources().dispensers as Record<string, DispenserResource>;
    const manager = new DispenserResourceManager(resourceData);
    const dispensers = fakeResources().dispensers;
    const keysOfDispensers = dispensers && Object.keys(dispensers);
    expect(Object.keys(manager.all)).toEqual(keysOfDispensers);
  });

  test('Conversion of a dispensers` dictionary to an array of dictionaries', () => {
    const manager = new DispenserResourceManager({
      testDispenser: {
        icons: {
          testDispenser: '',
        },
        location: { x: 1, y: 1, yaw: 1, level_name: 'L1' },
      },
    });
    expect(manager.allValues).toEqual([
      {
        icons: {
          testDispenser: '',
        },
        location: { x: 1, y: 1, yaw: 1, level_name: 'L1' },
        guid: 'testDispenser',
      },
    ]);
  });
});
