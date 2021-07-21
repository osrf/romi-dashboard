import { render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RmfAction } from '../../permissions';
import { AddPermissionDialog } from '../add-permission-dialog';

describe('AddPermissionDialog', () => {
  it('calls savePermission when form is submitted', async () => {
    const savePermission = jest.fn();
    const root = render(<AddPermissionDialog open={true} savePermission={savePermission} />);
    userEvent.click(root.getByLabelText('Action'));
    userEvent.click(root.getByText('Task Read'));
    userEvent.type(root.getByLabelText('Authorization Group'), 'test group');
    root.getByRole('form').dispatchEvent(new Event('submit'));
    expect(savePermission).toHaveBeenCalled();
    expect(savePermission.mock.calls[0][0].action).toBe(RmfAction.TaskRead);
    expect(savePermission.mock.calls[0][0].authz_grp).toBe('test group');
    await expect(
      waitForElementToBeRemoved(() => root.queryByLabelText('loading')),
    ).resolves.not.toBeNull();
  });
});
