import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ConfirmationDialog } from './confirmation-dialog';

describe('ConfirmDialogActions', () => {
  it('calls onCancelClick when cancel button is clicked', () => {
    const onCancelClick = jasmine.createSpy();
    const root = render(<ConfirmationDialog open={true} onCancelClick={onCancelClick} />);
    userEvent.click(root.getByText('Cancel'));
    expect(onCancelClick).toHaveBeenCalled();
  });

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = jasmine.createSpy();
    const root = render(<ConfirmationDialog open={true} onSubmit={onSubmit} />);
    userEvent.click(root.getByText('OK'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
