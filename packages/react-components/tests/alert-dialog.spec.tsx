import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AlertDialog } from '../lib';

it('triggers onPositiveClick', () => {
  const mockOnClick = jasmine.createSpy();
  const root = render(
    <AlertDialog open={true} title="test" variant="warn" onPositiveClick={mockOnClick} />,
  );
  userEvent.click(root.getByText('OK'));
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

it('negative button is shown only when negativeText is provided', () => {
  const root = render(<AlertDialog open={true} title="test" variant="warn" />);
  expect(root.queryAllByRole('button')).toHaveSize(1);
  root.unmount();

  const root2 = render(
    <AlertDialog open={true} title="test" variant="warn" negativeText="Cancel" />,
  );
  expect(root2.queryAllByRole('button')).toHaveSize(2);
});

it('triggers onNegativeClick', () => {
  const mockOnClick = jasmine.createSpy();
  const root = render(
    <AlertDialog
      open={true}
      title="test"
      variant="warn"
      negativeText="Cancel"
      onNegativeClick={mockOnClick}
    />,
  );
  userEvent.click(root.getByText('Cancel'));
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

it('has close button when onCloseClick is provided', () => {
  const mockOnClick = jasmine.createSpy();
  const root = render(
    <AlertDialog open={true} title="test" variant="warn" onCloseClick={mockOnClick} />,
  );
  expect(root.getByLabelText('close')).toBeTruthy();
});
