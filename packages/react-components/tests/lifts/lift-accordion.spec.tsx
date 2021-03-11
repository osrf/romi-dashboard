import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { cleanup, render, within } from '@testing-library/react';
import React from 'react';
import { LiftAccordion } from '../../lib';
import { allDoorStates, allLiftModes, allLiftMotion, makeLift, makeLiftState } from './test-utils';

it('smoke test with different lift motion', () => {
  allLiftMotion()
    .map((motion) =>
      makeLiftState({
        motion_state: motion,
      }),
    )
    .forEach((state) => {
      render(<LiftAccordion lift={makeLift()} liftState={state} />);
      cleanup();
    });
});

it('smoke test without lift state', () => {
  render(<LiftAccordion lift={makeLift()} />);
});

it('smoke test with different lift modes', () => {
  allLiftModes().forEach((mode) => {
    render(
      <LiftAccordion
        lift={makeLift()}
        liftState={makeLiftState({
          current_mode: mode,
        })}
      />,
    );
  });
});

it('smoke test with different door modes', () => {
  allDoorStates().forEach((doorState) => {
    render(
      <LiftAccordion
        lift={makeLift()}
        liftState={makeLiftState({
          door_state: doorState,
        })}
      />,
    );
  });
});

it('renders basic lift information', () => {
  const lift = makeLift({
    name: 'test_lift',
    doors: [
      {
        name: 'door',
        door_type: RomiCore.Door.DOOR_TYPE_DOUBLE_TELESCOPE,
        motion_direction: 1,
        motion_range: Math.PI / 2,
        v1_x: -1,
        v1_y: -1,
        v2_x: 1,
        v2_y: -1,
      },
    ],
  });
  const liftState = makeLiftState({
    lift_name: 'test_lift',
    available_floors: ['L1', 'L2'],
    available_modes: Uint8Array.from([RomiCore.LiftState.MODE_AGV]),
    current_floor: 'L1',
    current_mode: RomiCore.LiftState.MODE_AGV,
    destination_floor: 'L1',
    door_state: RomiCore.LiftState.DOOR_CLOSED,
    motion_state: RomiCore.LiftState.MOTION_STOPPED,
    session_id: 'test_session',
  });
  const accordion = render(<LiftAccordion lift={lift} liftState={liftState} />);
  const rows = accordion.queryAllByRole('row', { hidden: true });

  const nameRow = rows.find((r) => r.getAttribute('aria-label') === 'Name')!;
  expect(nameRow).toBeTruthy();
  expect(within(nameRow).queryByText('test_lift')).toBeTruthy();

  const location = rows.find((r) => r.getAttribute('aria-label') === 'Location')!;
  expect(location).toBeTruthy();
  expect(within(location).queryByText('(0.000, 0.000)')).toBeTruthy();

  const destFloor = rows.find((r) => r.getAttribute('aria-label') === 'Destination Floor')!;
  expect(destFloor).toBeTruthy();
  expect(within(destFloor).queryByText('L1')).toBeTruthy();

  const availFloors = rows.find((r) => r.getAttribute('aria-label') === 'Available Floors')!;
  expect(availFloors).toBeTruthy();
  expect(within(availFloors).queryByText('L1')).toBeTruthy();
  expect(within(availFloors).queryByText('L2')).toBeTruthy();

  const curMode = rows.find((r) => r.getAttribute('aria-label') === 'Current Mode')!;
  expect(curMode).toBeTruthy();
  expect(within(curMode).queryByText('AGV')).toBeTruthy();

  const availModes = rows.find((r) => r.getAttribute('aria-label') === 'Available Modes')!;
  expect(availModes).toBeTruthy();
  expect(within(availModes).queryByText('AGV')).toBeTruthy();

  const doorState = rows.find((r) => r.getAttribute('aria-label') === 'Door State')!;
  expect(doorState).toBeTruthy();
  expect(within(doorState).queryByText('Closed')).toBeTruthy();

  const motionState = rows.find((r) => r.getAttribute('aria-label') === 'Motion State')!;
  expect(motionState).toBeTruthy();
  expect(within(motionState).queryByText('Stopped')).toBeTruthy();
});
