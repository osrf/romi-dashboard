import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { cleanup, render, within } from '@testing-library/react';
import React from 'react';
import { DispenserAccordion } from '../../lib';
import { allStateModes, makeDispenserState } from './test-utils';

it('smoke test with different states', () => {
  allStateModes().forEach((mode) => {
    render(
      <DispenserAccordion
        dispenser="test_dispenser"
        dispenserState={makeDispenserState({ mode })}
      />,
    );
    cleanup();
  });
});

it('smoke test with no state', () => {
  render(<DispenserAccordion dispenser="test_dispenser" dispenserState={null} />);
});

it('renders basic information', () => {
  const dispenser = 'test_dispenser';
  const state = makeDispenserState({
    guid: 'test_dispenser',
    mode: RomiCore.DispenserState.IDLE,
    request_guid_queue: ['test_task'],
    seconds_remaining: 10,
  });
  const accordion = render(<DispenserAccordion dispenser={dispenser} dispenserState={state} />);
  const rows = accordion.queryAllByRole('row', { hidden: true });

  const nameRow = rows.find((r) => r.getAttribute('aria-label') === 'Name')!;
  expect(nameRow).toBeTruthy();
  expect(within(nameRow).queryByText('test_dispenser')).toBeTruthy();

  const queuedReqs = rows.find((r) => r.getAttribute('aria-label') === 'No. Queued Requests')!;
  expect(queuedReqs).toBeTruthy();
  expect(within(queuedReqs).queryByText('1')).toBeTruthy();

  const curReq = rows.find((r) => r.getAttribute('aria-label') === 'Request Queue ID')!;
  expect(curReq).toBeTruthy();
  expect(within(curReq).queryByText('test_task')).toBeTruthy();

  const secsRemaining = rows.find((r) => r.getAttribute('aria-label') === 'Seconds Remaining')!;
  expect(secsRemaining).toBeTruthy();
  expect(within(secsRemaining).queryByText('10')).toBeTruthy();
});
