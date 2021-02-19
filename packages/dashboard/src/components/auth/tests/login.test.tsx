import { createMount } from '@material-ui/core/test-utils';
import React from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AuthenticatorContext, UserContext } from '../../auth/contexts';
import Login from '../login';
import FakeAuthenticator from '../__mocks__/authenticator';

const mount = createMount();

describe('Login page', () => {
  test('renders correctly', () => {
    const component = mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    expect(component).toMatchSnapshot();
  });

  test('redirects to dashboard when user is authenticated', () => {
    window.history.replaceState(window.history.state, '');
    const wrapper = mount(
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
    expect(wrapper.find(Redirect)).toBeTruthy();
  });

  test('performs login when login button is clicked', () => {
    const authenticator = new FakeAuthenticator({ username: 'fakeUser' });
    const spy = jest.spyOn(authenticator, 'login').mockImplementation(() => undefined as any);

    const root = mount(
      <BrowserRouter>
        <AuthenticatorContext.Provider value={authenticator}>
          <Login />
        </AuthenticatorContext.Provider>
      </BrowserRouter>,
    );
    const loginButton = root.find('button#login-button').first();
    expect(loginButton).toBeTruthy();
    loginButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
