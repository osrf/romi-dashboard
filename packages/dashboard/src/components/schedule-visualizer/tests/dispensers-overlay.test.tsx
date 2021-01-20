import { createMount } from '@material-ui/core/test-utils';
import L from 'leaflet';
import React from 'react';
import { DispenserMarker } from 'react-components';
import { Map as LMap } from 'react-leaflet';
import ResourceManager from '../../../managers/resource-manager';
import fakeResources from '../../../mock/data/resources';
import { ResourcesContext } from '../../app-contexts';
import DispensersOverlay from '../dispensers-overlay';

const mount = createMount();

describe('Dispensers Overlay', () => {
  test('Render robots correctly', async () => {
    const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
    const resources = new ResourceManager(fakeResources());

    const wrapper = mount(
      <ResourcesContext.Provider value={resources}>
        <LMap>
          <DispensersOverlay bounds={bounds} currentFloorName="L1" />
        </LMap>
      </ResourcesContext.Provider>,
    );

    expect(wrapper.find(DispenserMarker).exists()).toBeTruthy();

    expect(wrapper.find(DispenserMarker).length).toBe(resources.dispensers?.allValues?.length);

    wrapper.unmount();
  });
});
