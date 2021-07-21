import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import RmfHealthStateManager from '../../../managers/rmf-health-state-manager';
import { RmfHealthContext } from '../../rmf-app';
import MainMenu from '../wip-main-menu-plusplus';
import { door, fakeFleets, lift } from './items';

const fleet = fakeFleets();

const healthManager = new RmfHealthStateManager();
let healthStatus = healthManager.getHealthStatus();
healthStatus = {
  door: {
    operational: 1,
    spoiltItem: [],
  },
  lift: {
    operational: 1,
    spoiltItem: [],
  },
  dispenser: {
    operational: 1,
    spoiltItem: [],
  },
  robot: {
    operational: 1,
    charging: 0,
    idle: 0,
    spoiltRobots: [],
  },
};

it('renders without crashing', () => {
  const root = render(
    <RmfHealthContext.Provider value={healthStatus}>
      <MainMenu pushView={jest.fn()} setFilter={jest.fn()} tasks={[]} notifications={[]} />,
    </RmfHealthContext.Provider>,
  );
  root.unmount();
});

it('should count working equipment as operational', () => {
  render(
    <RmfHealthContext.Provider value={healthStatus}>
      <MainMenu pushView={jest.fn()} tasks={[]} notifications={[]} />
    </RmfHealthContext.Provider>,
  );

  expect(screen.getByLabelText('Door-operational').textContent).toEqual('1/1');
  expect(screen.getByLabelText('Lift-operational').textContent).toEqual('1/1');
  expect(screen.getByLabelText('Dispenser-operational').textContent).toEqual('1/1');
  expect(screen.getByLabelText('Robot-operational').textContent).toEqual('1/1');
});

it('it should not count spoilt equipment as operational', () => {
  healthStatus = {
    door: {
      ...healthStatus.door,
      spoiltItem: [{ name: 'name', state: 'state', door: door }],
    },
    lift: {
      ...healthStatus.lift,
      spoiltItem: [{ name: 'name', state: 'state', lift: lift }],
    },
    dispenser: {
      ...healthStatus.dispenser,
      spoiltItem: [{ name: 'name', state: 'state', dispenser: 'dispenser' }],
    },
    robot: {
      operational: 1,
      charging: 0,
      idle: 0,
      spoiltRobots: [{ fleet: 'fleet', name: 'robot', state: 'state', robot: fleet[0].robots[0] }],
    },
  };

  render(
    <RmfHealthContext.Provider value={healthStatus}>
      <MainMenu pushView={jest.fn()} tasks={[]} notifications={[]} />
    </RmfHealthContext.Provider>,
  );

  expect(screen.getByLabelText('Door-operational').textContent).toEqual('1/2');
  expect(screen.getByLabelText('Lift-operational').textContent).toEqual('1/2');
  expect(screen.getByLabelText('Dispenser-operational').textContent).toEqual('1/2');
  expect(screen.getByLabelText('Robot-operational').textContent).toEqual('1/2');
});

it('should count robots that are charging and on idle as operational', () => {
  healthStatus = {
    ...healthStatus,
    robot: {
      operational: 2,
      charging: 1,
      idle: 1,
      spoiltRobots: [],
    },
  };

  render(
    <RmfHealthContext.Provider value={healthStatus}>
      <MainMenu pushView={jest.fn()} tasks={[]} notifications={[]} />
    </RmfHealthContext.Provider>,
  );

  expect(screen.getByLabelText('Robot-operational').textContent).toEqual('2/2');
  expect(screen.getByLabelText('Robot-idle').textContent).toEqual('1');
  expect(screen.getByLabelText('Robot-charging').textContent).toEqual('1');
});

it('should call pushView and setFilter when Details button is clicked', () => {
  const mockPushView = jest.fn();
  const mockSetFilter = jest.fn();

  render(
    <RmfHealthContext.Provider value={healthStatus}>
      <MainMenu pushView={mockPushView} setFilter={mockSetFilter} tasks={[]} notifications={[]} />
    </RmfHealthContext.Provider>,
  );

  userEvent.click(screen.getAllByText('Details')[0]);
  userEvent.click(screen.getAllByText('Details')[1]);
  userEvent.click(screen.getAllByText('Details')[2]);
  userEvent.click(screen.getAllByText('Details')[3]);

  expect(mockPushView).toBeCalledTimes(4);
  expect(mockSetFilter).toBeCalledTimes(4);
});

it('should call pushView and setFilter when Negotiations button is clicked', () => {
  const mockPushView = jest.fn();
  const mockSetFilter = jest.fn();

  render(
    <RmfHealthContext.Provider value={healthStatus}>
      <MainMenu pushView={mockPushView} setFilter={mockSetFilter} tasks={[]} notifications={[]} />
    </RmfHealthContext.Provider>,
  );

  userEvent.click(screen.getByTestId('negotiations-tooltip-tooltip'));

  expect(mockPushView).toBeCalledTimes(1);
  expect(mockSetFilter).toBeCalledTimes(1);
});
