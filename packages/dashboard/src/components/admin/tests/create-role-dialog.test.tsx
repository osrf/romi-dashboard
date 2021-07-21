import { render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CreateRoleDialog } from '../create-role-dialog';

describe('CreateRoleDialog', () => {
  it('calls createRole when form is submitted', async () => {
    const createRole = jest.fn();
    const root = render(<CreateRoleDialog open={true} createRole={createRole} />);
    userEvent.type(root.getByLabelText('Role'), 'role');
    root.getByRole('form').dispatchEvent(new Event('submit'));
    expect(createRole).toHaveBeenCalled();
    expect(createRole.mock.calls[0][0]).toBe('role');
    await expect(
      waitForElementToBeRemoved(() => root.queryByLabelText('loading')),
    ).resolves.not.toBeNull();
  });
});
