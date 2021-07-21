import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { Authenticator } from '../../lib/authenticator';
import { LoginHOC } from '../../lib/components/login-hoc';
import { FakeAuthenticator } from '../fake-authenticator';

describe('Login page', () => {
  let Login: ReturnType<typeof LoginHOC>;
  let user: string;
  let authenticator: Authenticator;

  beforeEach(() => {
    Login = LoginHOC(Redirect);
    user = 'test';
    authenticator = new FakeAuthenticator();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders without crashing', () => {
    const root = render(
      <BrowserRouter>
        <Login
          user={user}
          title={'Reporting'}
          authenticator={authenticator}
          successRedirectUri={'test'}
        />
      </BrowserRouter>,
    );
    root.unmount();
  });

  test('redirects from login when user is authenticated', () => {
    const root = render(
      <BrowserRouter>
        <Login
          user={user}
          title={'Reporting'}
          authenticator={authenticator}
          successRedirectUri={'test'}
        />
      </BrowserRouter>,
    );

    expect(root.queryByText('Login')).toBeFalsy();
  });

  test('performs login when login button is clicked', () => {
    const authenticator = new FakeAuthenticator('fakeUser');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = jest.spyOn(authenticator, 'login').mockImplementation(() => undefined as any);

    const root = render(
      <BrowserRouter>
        <Login
          user={null}
          title={'Reporting'}
          authenticator={authenticator}
          successRedirectUri={'test'}
        />
      </BrowserRouter>,
    );
    const loginButton = root.getByRole('button', { name: /Login/i });
    userEvent.click(loginButton);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
