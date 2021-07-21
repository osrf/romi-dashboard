import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { BrowserRouter, Redirect, Router, Switch } from 'react-router-dom';
import PrivateRouteBase from '../../lib/components/private-route-base';

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
        <PrivateRouteBase
          user="test"
          unauthorized={<h1>unauthorized</h1>}
          redirect={<Redirect to={{ pathname: '/test', state: { from: location } }} />}
        />
      </BrowserRouter>,
    );
    root.unmount();
  });

  test('redirects when unauthenticated', () => {
    const root = render(
      <Router history={history}>
        <Switch>
          <PrivateRouteBase
            unauthorized={<h1>unauthorized</h1>}
            redirect={<Redirect to={{ pathname: '/login', state: { from: location } }} />}
          />
        </Switch>
      </Router>,
    );
    expect(history.location.pathname).toBe('/login');
    root.unmount();
  });

  test('no redirects when authenticated', () => {
    const root = render(
      <Router history={history}>
        <Switch>
          <PrivateRouteBase
            user="test"
            unauthorized={<h1>unauthorized</h1>}
            redirect={<Redirect to={{ pathname: '/login', state: { from: location } }} />}
          />
        </Switch>
      </Router>,
    );
    expect(history.location.pathname).toBe('/private');
    root.unmount();
  });

  test('shows unauthorized page when noRedirectToLogin is true', async () => {
    render(
      <BrowserRouter>
        <PrivateRouteBase
          noRedirectToLogin={true}
          user="test"
          unauthorized={<h1>unauthorized</h1>}
          redirect={<Redirect to={{ pathname: '/login', state: { from: location } }} />}
        />
      </BrowserRouter>,
    );
    waitFor(() => {
      expect(screen.getByText('unauthorized')).toBeTruthy();
    });
    expect(history.location.pathname).toBe('/private');
  });
});
