import { render } from '@testing-library/react';
import React from 'react';
import { User, UserContext } from '../auth/contexts';

export const superUser: User = {
  profile: {
    username: 'test',
    is_admin: true,
    roles: [],
  },
  permissions: [],
};

export function mountAsUser(user: User, component: React.ReactElement) {
  return render(<UserContext.Provider value={user}>{component}</UserContext.Provider>);
}
