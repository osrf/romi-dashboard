import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NegotiationConflict,
  NegotiationStatusManager,
  ResolveState,
} from '../../../managers/negotiation-status-manager';
import NegotiationsPanel from '../negotiations-panel';

let negotiationStatuses: Record<number, NegotiationConflict>;
let setNegotiationTrajStore: jest.Mock<any, any>;

beforeEach(() => {
  setNegotiationTrajStore = jest.fn();
  negotiationStatuses = {
    0: {
      participantIdsToNames: {
        '1': 'tinyrobot1',
        '2': 'tinyrobot2',
      },
      participantIdsToStatus: {
        '1': {
          hasTerminal: true,
          base: {
            sequence: [1],
            defunct: false,
            rejected: true,
            forfeited: false,
          },
          terminal: {
            sequence: [2, 1],
            defunct: false,
            rejected: false,
            forfeited: false,
          },
        },
        '2': {
          hasTerminal: false,
          base: {
            sequence: [2],
            defunct: false,
            rejected: false,
            forfeited: true,
          },
          terminal: {
            sequence: [1, 2],
            defunct: true,
            rejected: false,
            forfeited: false,
          },
        },
      },
      resolved: ResolveState.RESOLVED,
    },
  };
});

it('renders negotiations correctly', () => {
  const root = render(
    <NegotiationsPanel
      conflicts={negotiationStatuses}
      spotlight={undefined}
      mapFloorLayerSorted={undefined}
      negotiationStatusManager={undefined}
      negotiationTrajStore={undefined}
      negotiationStatusUpdateTS={0}
      setNegotiationTrajStore={setNegotiationTrajStore}
    />,
  );

  const conflictLabel = root.getByRole('treeitem', { name: /Conflict/i });
  userEvent.click(conflictLabel);
  const finishedLabel = root.getByRole('treeitem', { name: /[FINISHED]/i });
  const forfeitedLabel = root.getAllByRole('treeitem', { name: /[FORFEITED]/i });
  expect(forfeitedLabel.length).toBe(1);

  userEvent.click(finishedLabel);
  const rejectedLabel = root.getAllByRole('treeitem', { name: /[REJECTED]/i });
  expect(rejectedLabel.length).toBe(1);
  root.unmount();
});

it('should empty all current negotiations when clear button is clicked', () => {
  const root = render(
    <NegotiationsPanel
      conflicts={negotiationStatuses}
      spotlight={undefined}
      mapFloorLayerSorted={undefined}
      negotiationStatusManager={undefined}
      negotiationTrajStore={undefined}
      negotiationStatusUpdateTS={0}
      setNegotiationTrajStore={setNegotiationTrajStore}
    />,
  );
  const clear = root.getByRole('button', {
    name: /Clear/i,
  });
  userEvent.click(clear);
  expect(root.queryByRole('treeitem')).toBeFalsy();
  root.unmount();
});

it('should call setNegotiationTrajStore callback when reset-button is clicked', () => {
  const root = render(
    <NegotiationsPanel
      conflicts={negotiationStatuses}
      spotlight={undefined}
      mapFloorLayerSorted={undefined}
      negotiationStatusManager={undefined}
      negotiationTrajStore={undefined}
      negotiationStatusUpdateTS={0}
      setNegotiationTrajStore={setNegotiationTrajStore}
    />,
  );

  const reset = root.getByRole('button', {
    name: /Reset/i,
  });
  userEvent.click(reset);

  expect(setNegotiationTrajStore).toHaveBeenCalled();
  root.unmount();
});

it('should render all negotiations when restore button is clicked', () => {
  const root = render(
    <NegotiationsPanel
      conflicts={negotiationStatuses}
      spotlight={undefined}
      mapFloorLayerSorted={undefined}
      negotiationStatusManager={undefined}
      negotiationTrajStore={undefined}
      negotiationStatusUpdateTS={0}
      setNegotiationTrajStore={setNegotiationTrajStore}
    />,
  );
  // clear all trajectories first to ensure empty array
  const clearButton = root.getByRole('button', {
    name: /Clear/i,
  });
  userEvent.click(clearButton);
  const restoreButton = root.getByRole('button', {
    name: /Restore/i,
  });
  userEvent.click(restoreButton);

  expect(root.queryByRole('treeitem')).toBeTruthy();
  root.unmount();
});

it('should set disabled to true on buttons when empty conflicts is provided', () => {
  const root = render(
    <NegotiationsPanel
      conflicts={{}}
      spotlight={undefined}
      mapFloorLayerSorted={undefined}
      negotiationStatusManager={undefined}
      negotiationTrajStore={undefined}
      negotiationStatusUpdateTS={0}
      setNegotiationTrajStore={setNegotiationTrajStore}
    />,
  );

  const clearButton = root.getByRole('button', {
    name: /Clear/i,
  });
  const restoreButton = root.getByRole('button', {
    name: /Restore/i,
  });
  const resetButton = root.getByRole('button', {
    name: /Reset/i,
  });

  expect(clearButton).toBeDisabled();
  expect(restoreButton).toBeDisabled();
  expect(resetButton).toBeDisabled();
});

it('tests negotiation status manager', () => {
  let negotiationStatusManager: NegotiationStatusManager;
  negotiationStatusManager = new NegotiationStatusManager('');

  let conflicts = negotiationStatusManager.allConflicts();
  expect(conflicts).toBeDefined();

  negotiationStatusManager.removeOldConflicts();
  let conflicts2 = negotiationStatusManager.allConflicts();
  expect(conflicts2).toBeDefined();
});
