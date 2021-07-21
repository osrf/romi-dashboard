import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AdminDrawer } from '../drawer';

describe('AdminDrawer', () => {
  it('calls onItemClick when item is clicked', () => {
    const onItemClick = jest.fn();
    const root = render(<AdminDrawer active="Users" onItemClick={onItemClick} />);
    userEvent.click(root.getByText('Roles'));
    expect(onItemClick).toHaveBeenCalled();
    expect(onItemClick.mock.calls[0][1]).toBe('Roles');
  });

  it('does not call onItemClick when clicking current active item', () => {
    const onItemClick = jest.fn();
    const root = render(<AdminDrawer active="Users" onItemClick={onItemClick} />);
    userEvent.click(root.getByText('Users'));
    expect(onItemClick).not.toHaveBeenCalled();
  });
});
