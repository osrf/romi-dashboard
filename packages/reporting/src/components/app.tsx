import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { NotFoundPage, rmfLight } from 'react-components';
import { BrowserRouter, Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { getUrl, LoginHOC, PrivateRouteHOC, User } from 'rmf-auth';
import appConfig from '../app-config';
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from '../util/url';
import { AppConfigContext } from './app-contexts';
import { AuthenticatorContext, UserContext } from './auth-contexts';
import Dashboard from './dashboard';

export default function App(): JSX.Element | null {
  const authenticator = appConfig.authenticator;
  const [authInitialized, setAuthInitialized] = React.useState(!!authenticator.user);
  const [user, setUser] = React.useState<User | null>(authenticator.user || null);
  const appRoutes = [DASHBOARD_ROUTE];

  React.useEffect(() => {
    if (user) {
      return;
    }
    const onUserChanged = (newUser: User | null) => setUser(newUser);
    authenticator.on('userChanged', onUserChanged);
    (async () => {
      await authenticator.init();
      setUser(authenticator.user || null);
      setAuthInitialized(true);
    })();
    return () => {
      authenticator.off('userChanged', onUserChanged);
    };
  }, [authenticator, user]);

  const PrivateRoute = PrivateRouteHOC(Route, Redirect, useLocation);
  const Login = LoginHOC(Redirect);

  return authInitialized ? (
    <AppConfigContext.Provider value={appConfig}>
      <AuthenticatorContext.Provider value={authenticator}>
        <UserContext.Provider value={user}>
          <ThemeProvider theme={rmfLight}>
            <BrowserRouter>
              <Switch>
                <Route exact path={LOGIN_ROUTE}>
                  <Login
                    user={user}
                    title={'Reporting'}
                    authenticator={authenticator}
                    successRedirectUri={getUrl(DASHBOARD_ROUTE)}
                  />
                </Route>
                <PrivateRoute exact path={appRoutes} redirectPath={LOGIN_ROUTE} user={user}>
                  <Switch>
                    <PrivateRoute
                      exact
                      path={DASHBOARD_ROUTE}
                      redirectPath={LOGIN_ROUTE}
                      user={user}
                    >
                      <Dashboard />
                    </PrivateRoute>
                  </Switch>
                </PrivateRoute>
                <Route>
                  <NotFoundPage routeLinkComponent={<Link to={LOGIN_ROUTE}>Go to Login</Link>} />
                </Route>
              </Switch>
            </BrowserRouter>
          </ThemeProvider>
        </UserContext.Provider>
      </AuthenticatorContext.Provider>
    </AppConfigContext.Provider>
  ) : null;
}
