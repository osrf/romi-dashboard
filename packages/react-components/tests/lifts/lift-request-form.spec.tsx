import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LiftRequestForm } from '../../lib';
import { requestDoorModes, requestModes } from '../../lib/lifts/lift-utils';
import { makeLift } from './test-utils';

function renderLiftRequestForm() {
  return render(
    <LiftRequestForm
      lift={makeLift()}
      availableRequestTypes={requestModes}
      availableDoorModes={requestDoorModes}
    />,
  );
}

describe('Lift request form', () => {
  let root: ReturnType<typeof renderLiftRequestForm>;

  beforeEach(() => {
    root = render(
      <LiftRequestForm
        lift={makeLift()}
        availableRequestTypes={requestModes}
        availableDoorModes={requestDoorModes}
      />,
    );
  });

  it('resets form after submitting', () => {
    userEvent.click(root.getByPlaceholderText('Pick a Destination'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('L2'));
    userEvent.click(root.getByPlaceholderText('Pick a Door State'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('Closed'));
    userEvent.click(root.getByPlaceholderText('Pick Request Type'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('Human'));

    userEvent.click(root.getByText('Request'));

    expect(root.getByPlaceholderText('Pick a Destination').getAttribute('value')).toBe('L1');
    expect(root.getByPlaceholderText('Pick a Door State').getAttribute('value')).toBe('Open');
    expect(root.getByPlaceholderText('Pick Request Type').getAttribute('value')).toBe('AGV');
  });

  it('destination is required', () => {
    userEvent.type(root.getByPlaceholderText('Pick a Destination'), '{selectall}{backspace}');
    userEvent.click(root.getByText('Request'));
    expect(root.container.querySelector('.MuiFormHelperText-root.Mui-error')).toBeTruthy();
  });
});
