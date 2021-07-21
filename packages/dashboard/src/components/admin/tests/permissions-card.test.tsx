import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { getActionText, RmfAction } from '../../permissions';
import { PermissionsCard } from '../permissions-card';

describe('PermissionsCard', () => {
  it('renders permissions', () => {
    const root = render(
      <PermissionsCard permissions={[{ action: RmfAction.TaskRead, authz_grp: 'test_group' }]} />,
    );
    expect(() => root.getByText(getActionText(RmfAction.TaskRead))).not.toThrow();
    expect(() => root.getByText('test_group')).not.toThrow();
  });

  it('opens add permission dialog when button is clicked', () => {
    const root = render(<PermissionsCard />);
    userEvent.click(root.getByLabelText('add permission'));
    expect(() => root.getByText('Add Permission')).not.toThrow();
  });

  it('calls onRemovePermissionClick when button is clicked', () => {
    const onRemovePermissionClick = jest.fn();
    const root = render(
      <PermissionsCard
        permissions={[{ action: RmfAction.TaskRead, authz_grp: 'test_group' }]}
        onRemovePermissionClick={onRemovePermissionClick}
      />,
    );
    userEvent.click(root.getByText('Remove'));
    expect(onRemovePermissionClick).toHaveBeenCalled();
    expect(onRemovePermissionClick.mock.calls[0][1].action).toBe(RmfAction.TaskRead);
    expect(onRemovePermissionClick.mock.calls[0][1].authz_grp).toBe('test_group');
  });
});
