import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DispenserMarker } from '../../lib';

it('triggers onClick callback when button is clicked', () => {
  const mockOnClick = jasmine.createSpy();

  const root = render(
    <svg>
      <DispenserMarker guid="test" location={[0, 0]} onClick={mockOnClick} data-testid="marker" />
    </svg>,
  );
  userEvent.click(root.getByTestId('marker'));
  expect(mockOnClick).toHaveBeenCalled();
});

it('smoke test - marker with image icon', () => {
  render(
    <svg>
      <DispenserMarker guid="test" location={[0, 0]} iconPath="/resources/ros-health.png" />
    </svg>,
  );
});
