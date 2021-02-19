import { createMount } from '@material-ui/core/test-utils';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import { DeliveryRequestForm, LoopRequestForm } from 'react-components';
import ResourceManager from '../../../managers/resource-manager';
import fakeResources from '../../../managers/__mocks__/resources';
import { ResourcesContext } from '../../app-contexts';
import CommandsPanel from '../commands-panel';
import fakeFleets from './fleets';

const mount = createMount();

let fleets: RomiCore.FleetState[];

beforeEach(() => {
  fleets = fakeFleets();
});

it('Renders loop and delivery form', () => {
  const resources = new ResourceManager(fakeResources());
  const root = mount(
    <ResourcesContext.Provider value={resources}>
      <CommandsPanel allFleets={fleets.map((fleet) => fleet.name)} />
    </ResourcesContext.Provider>,
  );

  expect(root.find(LoopRequestForm).length).toBe(1);
  expect(root.find(DeliveryRequestForm).length).toBe(1);

  root.unmount();
});

it('Renders error on render without context', () => {
  const root = mount(<CommandsPanel allFleets={fleets.map((fleet) => fleet.name)} />);
  expect(root.find('#no-config-file-error-msg').exists()).toBeTruthy();
  root.unmount();
});
