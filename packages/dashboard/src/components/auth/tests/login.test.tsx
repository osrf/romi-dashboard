import React from 'react';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticatorContext, UserContext } from '../../auth/contexts';
import Login from '../login';
import FakeAuthenticator from '../__mocks__/authenticator';

describe('Login page', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders without crashing', () => {
    const root = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    root.unmount();
  });

  test('redirects from login when user is authenticated', () => {
    const root = render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            username: 'test',
          }}
        >
          <Login />
        </UserContext.Provider>
      </BrowserRouter>,
    );

    expect(root.queryByText('Login')).toBeFalsy();
  });

  test('performs login when login button is clicked', () => {
    const authenticator = new FakeAuthenticator({ username: 'fakeUser' });
    const spy = jest.spyOn(authenticator, 'login').mockImplementation(() => undefined as any);

    const root = render(
      <BrowserRouter>
        <AuthenticatorContext.Provider value={authenticator}>
          <Login />
        </AuthenticatorContext.Provider>
      </BrowserRouter>,
    );
    const loginButton = root.getByRole('button', { name: /Login/i });
    userEvent.click(loginButton);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
