import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DoorMarker } from '../../lib';
import { allDoorModes, allDoorTypes, makeDoor } from './test-utils';

it('smoke test with different door modes', () => {
  allDoorModes().forEach((mode) => {
    render(
      <svg>
        <DoorMarker door={makeDoor()} doorMode={mode} />
      </svg>,
    );
    cleanup();
  });
});

it('smoke test with different door types', () => {
  allDoorTypes()
    .map((type) =>
      makeDoor({
        door_type: type,
      }),
    )
    .forEach((door) => {
      render(
        <svg>
          <DoorMarker door={door} />
        </svg>,
      );
      cleanup();
    });
});

it('triggers onClick callback when button is clicked', () => {
  const mockOnClick = jasmine.createSpy();

  const root = render(
    <svg>
      <DoorMarker door={makeDoor()} onClick={mockOnClick} data-testid="marker" />
    </svg>,
  );
  userEvent.click(root.getByTestId('marker'));
  expect(mockOnClick).toHaveBeenCalled();
});
