import { render } from '@testing-library/react';
import React from 'react';
import { UserProfileCard } from '../user-profile';

describe('UserProfileCard', () => {
  it('renders username', () => {
    const root = render(<UserProfileCard profile={{ username: 'test' }} />);
    root.getByText('test');
  });

  it('renders admin', () => {
    const root = render(<UserProfileCard profile={{ username: 'test', is_admin: true }} />);
    root.getByText('Admin');
  });
});
