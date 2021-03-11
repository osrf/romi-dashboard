import { render, screen } from '@testing-library/react';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import ResourceManager from '../../../managers/resource-manager';
import fakeResources from '../../../managers/__mocks__/resources';
import { ResourcesContext } from '../../app-contexts';
import CommandsPanel from '../commands-panel';
import fakeFleets from './fleets';

let fleets: RomiCore.FleetState[];

beforeEach(() => {
  fleets = fakeFleets();
});

it('Renders loop and delivery form', () => {
  const resources = new ResourceManager(fakeResources());
  render(
    <ResourcesContext.Provider value={resources}>
      <CommandsPanel allFleets={fleets.map((fleet) => fleet.name)} />
    </ResourcesContext.Provider>,
  );

  expect(screen.getByText('Loop Request')).toBeDefined();
  expect(screen.getByText('Delivery Request')).toBeDefined();
});

it('Renders error on render without context', () => {
  render(<CommandsPanel allFleets={fleets.map((fleet) => fleet.name)} />);
  expect(
    screen.getByText(
      'There was an error while loading the commands panel (unable to load resources metadata).',
    ),
  ).toBeDefined();
});
