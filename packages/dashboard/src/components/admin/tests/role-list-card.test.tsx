import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RoleListCard } from '../role-list-card';

describe('Role List', () => {
  it('renders list of roles', () => {
    const root = render(<RoleListCard roles={['role1', 'role2']} />);
    root.getByText('role1');
    root.getByText('role2');
  });

  it('opens create role dialog when button is clicked', () => {
    const root = render(<RoleListCard />);
    userEvent.click(root.getByLabelText('create role'));
    expect(() => root.getByText('Create Role')).not.toThrow();
  });
});
