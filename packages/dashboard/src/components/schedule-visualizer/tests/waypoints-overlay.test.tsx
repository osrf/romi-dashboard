import { mount } from 'enzyme';
import L from 'leaflet';
import React from 'react';
import { WaypointMarker } from 'react-components';
import { Map as LMap } from 'react-leaflet';
import WaypointsOverlay from '../waypoints-overlay';
import getBuildingMap from './building-map';

test('Render waypoints correctly', async () => {
  const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
  const buildingMap = await getBuildingMap();
  const currentLevel = buildingMap.levels[0];
  const nav_graphs = buildingMap.levels.flatMap((x) => x.nav_graphs);
  const waypoints = nav_graphs[0].vertices;

  const wrapper = mount(
    <LMap>
      <WaypointsOverlay bounds={bounds} currentLevel={currentLevel} />
    </LMap>,
  );

  expect(wrapper.find(WaypointMarker).exists()).toBeTruthy();
  expect(wrapper.find(WaypointMarker).length).toBe(waypoints.length);

  wrapper.unmount();
});
