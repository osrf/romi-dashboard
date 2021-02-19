import { RobotResource, RobotResourceManager } from '../resource-manager-robots';
import fakeResources from '../__mocks__/resources';

describe('The correct operation of the getAvailablePlacesPerFleet method of the RobotResourceManager class', () => {
  let manager: RobotResourceManager;
  let resourceData: Record<string, RobotResource>;

  beforeAll(() => {
    resourceData = fakeResources().robots;
    manager = new RobotResourceManager(resourceData);
  });

  test('Returns falsy when FleetName does not exist', () => {
    const places = manager.getAvailablePlacesPerFleet('Not exists');
    expect(places).toBeFalsy();
  });

  test('Correct assignation of places, when a fleet has places defined', () => {
    const fleetName = Object.keys(resourceData)[0]; // tinyRobot
    const places = manager.getAvailablePlacesPerFleet(fleetName) as String[];
    expect(Object.keys(places).length).toEqual(Object.keys(resourceData[fleetName].places).length);
  });

  test('Returns false when a fleet has no spaces defined', () => {
    const fleetName = Object.keys(resourceData)[1]; // deliveryRobot
    const places = manager.getAvailablePlacesPerFleet(fleetName) as String[];
    expect(Object.keys(places).length).toBeFalsy();
  });
});

describe('The correct operation of the getIconPath method of the RobotResourceManager class', () => {
  let manager: RobotResourceManager;
  let resourceData: Record<string, RobotResource>;

  beforeAll(() => {
    resourceData = fakeResources().robots!;
    manager = new RobotResourceManager(resourceData);
  });

  test('Returns falsy when fleetName does not exists', () => {
    const icon = manager.getIconPath('Not exists');
    expect(icon).toBeFalsy();
  });

  test('Returns falsy if the icon path it`s empty', () => {
    resourceData.testFleet = {
      icons: {
        testFleet: '',
      },
      places: {},
    };
    const icon = manager.getIconPath('testFleet');
    expect(icon).toBeFalsy();
  });

  test('Returns fleet model even if fleetName is also defined', () => {
    resourceData.testFleet = {
      icons: {
        testFleet: '/fleet',
        testModel: '/model',
      },
      places: {},
    };
    const icon = manager.getIconPath('testFleet', 'testModel');
    expect(icon).toEqual('/assets/icons/model');
  });

  test('Returns trusty if the icon path exists', () => {
    const fleetName = Object.keys(resourceData)[0]; // tinyRobot
    const icon = manager.getIconPath(fleetName);
    expect(icon).toBeTruthy();
  });
});

describe('The correct operation of the getDispensersPerFleet method of the RobotResourceManager class', () => {
  let manager: RobotResourceManager;
  let resourceData: Record<string, RobotResource>;

  beforeAll(() => {
    resourceData = fakeResources().robots;
    manager = new RobotResourceManager(resourceData);
  });

  test('Returns falsy when place exists but FleetName does not', () => {
    const dispenser = manager.getDispensersPerFleet('Not exists', 'supplies');
    expect(dispenser).toBeFalsy();
  });

  test('Return falsy when FleetName exists but Place does not', () => {
    const fleetName = Object.keys(resourceData)[0]; // tinyRobot
    const dispenser = manager.getDispensersPerFleet(fleetName, 'Not exists');
    expect(dispenser).toBeFalsy();
  });

  test('Returns 0 if a place has no dispenser', () => {
    const fleetName = Object.keys(resourceData)[0]; // tinyRobot
    const dispensers = manager.getDispensersPerFleet(fleetName, 'supplies');
    expect(dispensers?.length).toBe(0);
  });

  test('Returns the list of dispensers of a place', () => {
    const fleetName = Object.keys(resourceData)[0]; // tinyRobot
    const dispensers = manager.getDispensersPerFleet(fleetName, 'pantry');
    expect(dispensers?.length).toBe(resourceData[fleetName].places.pantry.length);
  });
});
