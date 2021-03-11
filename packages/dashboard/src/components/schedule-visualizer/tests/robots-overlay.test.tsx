import L from 'leaflet';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ColorManager, RobotMarkerProps } from 'react-components';
import { Map as LMap } from 'react-leaflet';
import RobotsOverlay from '../robots-overlay';
import getBuildingMap from './building-map';
import fakeFleets from './fleets';

function FakeMarker(props: RobotMarkerProps & { 'data-testid'?: string }) {
  return <div data-testid={props['data-testid']}></div>;
}

describe('Robots Overlay', () => {
  const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
  let conflictRobotNames: string[][] = [];

  test('Render robots correctly', async () => {
    const buildingMap = await getBuildingMap();
    const fleet = fakeFleets()[0];
    const robots = fleet.robots;
    const root = render(
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
          MarkerComponent={FakeMarker}
        />
      </LMap>,
    );
    await waitFor(() => expect(root.getAllByTestId('robotMarker').length).toBe(robots.length));
    root.unmount();
  });
});
