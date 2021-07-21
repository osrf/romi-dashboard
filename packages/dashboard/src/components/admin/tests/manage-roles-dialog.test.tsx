import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ManageRolesCard, ManageRolesDialog } from '../manage-roles-dialog';

describe('ManageRolesCard', () => {
  it('shows dialog when add/remove is clicked', async () => {
    const root = render(
      <ManageRolesCard
        assignedRoles={[]}
        getAllRoles={async () => new Promise((res) => setTimeout(() => res(['role1']), 1000))}
        saveRoles={async () => {}}
      />,
    );
    userEvent.click(root.getByText('Add/Remove'));
    await expect(
      waitForElementToBeRemoved(() => root.queryByLabelText('loading')),
    ).resolves.not.toThrow();
  });
});

describe('ManageRolesDialog', () => {
  it('it triggers cb when dialog is submitted', async () => {
    const saveRoles = jest.fn(async () => {});
    const root = render(
      <ManageRolesDialog
        open={true}
        setOpen={() => {}}
        defaultAssignedRoles={['role1']}
        getAllRoles={async () => ['role1', 'role2']}
        saveRoles={saveRoles}
      />,
    );
    await waitFor(() => root.queryByText('role1'));
    userEvent.click(root.getByText('Save'));
    expect(saveRoles).toHaveBeenCalled();
    await expect(
      waitForElementToBeRemoved(() => root.queryByLabelText('loading')),
    ).resolves.not.toThrow();
  });
});
