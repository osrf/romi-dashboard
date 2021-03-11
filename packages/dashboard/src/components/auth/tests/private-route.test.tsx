import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { cleanup, render, waitFor, RenderResult } from '@testing-library/react';
import { BrowserRouter, Router, Switch } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../../util/url';
import { AuthenticatorContext, UserContext } from '../../auth/contexts';
import PrivateRoute from '../private-route';
import FakeAuthenticator from '../__mocks__/authenticator';

describe('PrivateRoute', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    history = createMemoryHistory();
    history.location.pathname = '/private';
  });

  afterEach(() => {
    cleanup();
  });

  test('renders correctly', () => {
    const root = render(
      <BrowserRouter>
        <PrivateRoute path="/private" exact />
      </BrowserRouter>,
    );
    root.unmount();
  });

  test('redirects when unauthenticated', () => {
    render(
      <AuthenticatorContext.Provider value={new FakeAuthenticator()}>
        <Router history={history}>
          <Switch>
            <PrivateRoute path="/private" exact />
          </Switch>
        </Router>
      </AuthenticatorContext.Provider>,
    );
    expect(history.location.pathname).toBe(LOGIN_ROUTE);
  });

  test('no redirects when authenticated', () => {
    render(
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

  test('shows unauthorized page when noRedirectToLogin is true', async () => {
    let root: RenderResult;
    waitFor(() => {
      root = render(
        <BrowserRouter>
          <PrivateRoute path="/private" exact noRedirectToLogin />
        </BrowserRouter>,
      );
      expect(root.queryByText('Unauthorized')).toBeTruthy();
    });
    expect(history.location.pathname).toBe('/private');
  });
});
