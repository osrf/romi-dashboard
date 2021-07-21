import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { UserListCard } from '../user-list-card';

describe('UserListCard', () => {
  it('opens delete dialog when button is clicked', async () => {
    const root = render(<UserListCard searchUsers={() => ['user1']} />);
    await waitFor(() => root.getByText('Delete'));
    userEvent.click(root.getByText('Delete'));
    expect(() => root.getByText('Confirm Delete')).not.toThrow();
  });

  it('opens create user dialog when button is clicked', async () => {
    const root = render(<UserListCard />);
    userEvent.click(root.getByLabelText('create user'));
    expect(() => root.getByText('Create User')).not.toThrow();
  });

  it('calls searchUser when search box changes', async () => {
    const searchUsers = jest.fn(() => []);
    const root = render(<UserListCard searchUsers={searchUsers} />);
    userEvent.type(root.getByLabelText('Search Users'), 'test');
    await waitFor(() => expect(searchUsers).toHaveBeenCalledTimes(2), { timeout: 1000 });
    expect((searchUsers.mock.calls[1] as any[])[0]).toBe('test');
  });
});
