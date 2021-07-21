import { cleanup, render, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { BrowserRouter, Redirect, Route, Router, Switch, useLocation } from 'react-router-dom';
import { PrivateRouteHOC } from '../../lib';

describe('PrivateRoute', () => {
  let history: MemoryHistory;
  let PrivateRoute: ReturnType<typeof PrivateRouteHOC>;
  let user: string;
  const LOGIN_ROUTE = '/login';

  beforeEach(() => {
    history = createMemoryHistory();
    history.location.pathname = '/private';

    PrivateRoute = PrivateRouteHOC(Route, Redirect, useLocation);
    user = 'test';
  });

  afterEach(() => {
    cleanup();
  });

  test('renders correctly', () => {
    const root = render(
      <BrowserRouter>
        <PrivateRoute path="/private" exact redirectPath={LOGIN_ROUTE} user={user} />
      </BrowserRouter>,
    );
    root.unmount();
  });

  test('redirects when unauthenticated', () => {
    render(
      <Router history={history}>
        <Switch>
          <PrivateRoute path="/private" exact redirectPath={LOGIN_ROUTE} user={null} />
        </Switch>
      </Router>,
    );
    expect(history.location.pathname).toBe(LOGIN_ROUTE);
  });

  test('no redirects when authenticated', () => {
    render(
      <Router history={history}>
        <Switch>
          <PrivateRoute path="/private" exact redirectPath={LOGIN_ROUTE} user={user} />
        </Switch>
      </Router>,
    );
    expect(history.location.pathname).toBe('/private');
  });

  test('shows unauthorized page when noRedirectToLogin is true', async () => {
    const root = render(
      <BrowserRouter>
        <PrivateRoute
          path="/private"
          exact
          noRedirectToLogin
          redirectPath={LOGIN_ROUTE}
          user={user}
        />
      </BrowserRouter>,
    );
    waitFor(() => {
      expect(root.queryByText('Unauthorized')).toBeTruthy();
    });
    expect(history.location.pathname).toBe('/private');
  });
});
