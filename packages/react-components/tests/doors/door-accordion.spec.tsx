import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DoorAccordion } from '../../lib';
import { allDoorModes, allDoorTypes, makeDoor, makeDoorState } from './test-utils';

describe('Door accordion', () => {
  it('smoke test with different door types', () => {
    allDoorTypes()
      .map((type) =>
        makeDoor({
          door_type: type,
        }),
      )
      .forEach((door) => {
        render(<DoorAccordion door={door} />);
        cleanup();
      });
  });

  it('smoke test with different door modes', () => {
    allDoorModes()
      .map((mode) => makeDoorState({ current_mode: mode }))
      .forEach((state) => {
        render(<DoorAccordion door={makeDoor()} doorState={state} />);
        cleanup();
      });
  });

  it('smoke test with different motion direction', () => {
    [
      makeDoor({
        motion_direction: 1,
      }),
      makeDoor({
        motion_direction: -1,
      }),
      makeDoor({
        motion_direction: 100,
      }),
    ].forEach((door) => {
      render(<DoorAccordion door={door} />);
      cleanup();
    });
  });

  it('renders basic door information', () => {
    const door = makeDoor({
      name: 'test_door',
      door_type: RomiCore.Door.DOOR_TYPE_SINGLE_SWING,
      motion_direction: 1,
    });
    const doorState = makeDoorState({
      door_name: 'test_door',
      current_mode: { value: RomiCore.DoorMode.MODE_CLOSED },
    });
    const accordion = render(<DoorAccordion door={door} doorState={doorState} />);
    const rows = accordion.queryAllByRole('row', { hidden: true });

    const nameRow = rows.find((r) => r.getAttribute('aria-label') === 'Name')!;
    expect(nameRow).toBeTruthy();
    expect(within(nameRow).queryByText('test_door')).toBeTruthy();

    const type = rows.find((r) => r.getAttribute('aria-label') === 'Type')!;
    expect(type).toBeTruthy();
    expect(within(type).queryByText('Single Swing')).toBeTruthy();

    const motionDir = rows.find((r) => r.getAttribute('aria-label') === 'Motion Direction')!;
    expect(motionDir).toBeTruthy();
    expect(within(motionDir).queryByText('Clockwise')).toBeTruthy();

    const motionRange = rows.find((r) => r.getAttribute('aria-label') === 'Motion Range')!;
    expect(motionRange).toBeTruthy();
    expect(within(motionRange).queryByText('1.571')).toBeTruthy();

    const location = rows.find((r) => r.getAttribute('aria-label') === 'Location')!;
    expect(location).toBeTruthy();
    expect(within(location).queryByText('(0.000, 0.000)')).toBeTruthy();
  });

  it('triggers door control dispatch when open door button is clicked', () => {
    const fakeOnClick = jasmine.createSpy();
    const root = render(<DoorAccordion door={makeDoor()} onDoorControlClick={fakeOnClick} />);

    userEvent.click(root.getByText('Open'));
    expect(fakeOnClick).toHaveBeenCalledWith(
      jasmine.anything(),
      jasmine.anything(),
      RomiCore.DoorMode.MODE_OPEN,
    );
  });

  it('triggers door control dispatch when close door button is clicked', () => {
    const fakeOnClick = jasmine.createSpy();
    const root = render(<DoorAccordion door={makeDoor()} onDoorControlClick={fakeOnClick} />);

    userEvent.click(root.getByText('Close'));
    expect(fakeOnClick).toHaveBeenCalledWith(
      jasmine.anything(),
      jasmine.anything(),
      RomiCore.DoorMode.MODE_CLOSED,
    );
  });
});
