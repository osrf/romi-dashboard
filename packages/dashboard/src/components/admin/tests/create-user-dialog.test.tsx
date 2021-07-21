import { render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CreateUserDialog } from '../create-user-dialog';

describe('CreateUserDialog', () => {
  it('calls createUser when form is submitted', async () => {
    const createUser = jest.fn();
    const root = render(<CreateUserDialog open={true} createUser={createUser} />);
    userEvent.type(root.getByLabelText('Username'), 'user');
    root.getByRole('form').dispatchEvent(new Event('submit'));
    expect(createUser).toHaveBeenCalled();
    expect(createUser.mock.calls[0][0]).toBe('user');
    await expect(
      waitForElementToBeRemoved(() => root.queryByLabelText('loading')),
    ).resolves.not.toBeNull();
  });
});
