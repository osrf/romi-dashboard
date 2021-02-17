import React from 'react';
import { NotificationsDialog } from '../lib';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Notification, Severity } from '../lib';

const notifications: Notification[] = [
  { id: 1, time: 'time', error: 'message', severity: Severity.High },
  { id: 2, time: 'time', error: 'message', severity: Severity.Medium },
  { id: 3, time: 'time', error: 'message', severity: Severity.Low },
];

test('should call onClose when close button is clicked', () => {
  const mockOnClose = jest.fn();
  render(
    <NotificationsDialog
      onClose={mockOnClose}
      showNotificationsDialog={true}
      notifications={notifications}
    />,
  );
  userEvent.click(screen.getByText(/CLOSE/i));
  expect(mockOnClose).toHaveBeenCalled();
});

test('should call onClose when close icon at the top is clicked', () => {
  const mockOnClose = jest.fn();
  render(
    <NotificationsDialog
      onClose={mockOnClose}
      showNotificationsDialog={true}
      notifications={notifications}
    />,
  );
  userEvent.click(screen.getByLabelText(/close/i));
  expect(mockOnClose).toHaveBeenCalled();
});

test('should not render other severity levels when a particular level is selected', () => {
  const mockOnClose = jest.fn();
  render(
    <NotificationsDialog
      onClose={mockOnClose}
      showNotificationsDialog={true}
      notifications={notifications}
    />,
  );

  userEvent.paste(screen.getByDisplayValue(''), 'High');

  expect(screen.queryByText('Medium')).toBeNull();
  expect(screen.queryByText('Low')).toBeNull();
});
