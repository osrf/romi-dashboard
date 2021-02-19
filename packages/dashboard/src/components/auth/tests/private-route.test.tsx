import { createMount } from '@material-ui/core/test-utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, Router, Switch } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../../util/url';
import { AuthenticatorContext, UserContext } from '../../auth/contexts';
import Unauthorized from '../../error-pages/unauthorized';
import PrivateRoute from '../private-route';
import FakeAuthenticator from '../__mocks__/authenticator';

const mount = createMount();

describe('PrivateRoute', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    history = createMemoryHistory();
    history.location.pathname = '/private';
  });

  test('renders correctly', () => {
    const component = mount(
      <BrowserRouter>
        <PrivateRoute path="/private" exact />
      </BrowserRouter>,
    );
    expect(component.html()).toMatchSnapshot();
  });

  test('redirects when unauthenticated', async () => {
    await act(async () => {
      mount(
        <AuthenticatorContext.Provider value={new FakeAuthenticator()}>
          <Router history={history}>
            <Switch>
              <PrivateRoute path="/private" exact />
            </Switch>
          </Router>
        </AuthenticatorContext.Provider>,
      );
    });
    expect(history.location.pathname).toBe(LOGIN_ROUTE);
  });

  test('no redirects when authenticated', () => {
    mount(
      <UserContext.Provider value={{ username: 'test' }}>
        <Router history={history}>
          <Switch>
            <PrivateRoute path="/private" exact />
          </Switch>
        </Router>
      </UserContext.Provider>,
    );
    expect(history.location.pathname).toBe('/private');
  });

  test('shows unauthorized page when noRedirectToLogin is true', () => {
    const component = mount(
      <BrowserRouter>
        <PrivateRoute path="/private" exact noRedirectToLogin />
      </BrowserRouter>,
    );
    expect(history.location.pathname).toBe('/private');
    expect(component.find(Unauthorized)).toBeTruthy();
  });
});
