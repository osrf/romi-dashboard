import { mount, ReactWrapper } from 'enzyme';
import L from 'leaflet';
import React from 'react';
import { ColorManager, RobotMarker } from 'react-components';
import { act } from 'react-dom/test-utils';
import { Map as LMap } from 'react-leaflet';
import RobotsOverlay from '../robots-overlay';
import getBuildingMap from './building-map';
import fakeFleets from './fleets';

describe('Robots Overlay', () => {
  let colorManager: ColorManager;

  beforeEach(() => {
    // TextEncoder is not available in node
    colorManager = new ColorManager();
    colorManager.robotPrimaryColor = jest.fn(async () => 'black');
  });

  const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
  let conflictRobotNames: string[][] = [];

  test('Render robots correctly', async () => {
    const buildingMap = await getBuildingMap();
    const fleet = fakeFleets()[0];
    const robots = fleet.robots;
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <LMap
          bounds={[
            [0, 0],
            [1, 1],
          ]}
        >
          <RobotsOverlay
            fleets={[fleet]}
            bounds={bounds}
            conflictRobotNames={conflictRobotNames}
            currentFloorName={buildingMap.levels[0].name}
          />
        </LMap>,
      );
    });
    wrapper!.update();

    expect(wrapper!.find(RobotMarker).length).toBe(robots.length);

    wrapper!.unmount();
  });
});
