import L from 'leaflet';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Map as LMap } from 'react-leaflet';
import WaypointsOverlay from '../waypoints-overlay';
import getBuildingMap from './building-map';

test('Render waypoints correctly', async () => {
  const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
  const buildingMap = await getBuildingMap();
  const currentLevel = buildingMap.levels[0];
  const nav_graphs = buildingMap.levels.flatMap((x) => x.nav_graphs);
  const waypoints = nav_graphs[0].vertices;

  const root = render(
    <LMap
      bounds={[
        [0, 0],
        [1, 1],
      ]}
    >
      <WaypointsOverlay bounds={bounds} currentLevel={currentLevel} />
    </LMap>,
  );

  await waitFor(() => {
    expect(root.getAllByTestId('waypointMarker').length).toBe(waypoints.length);
  });

  root.unmount();
});
