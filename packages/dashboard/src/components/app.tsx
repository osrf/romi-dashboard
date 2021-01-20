import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'typeface-roboto';
import appConfig from '../app-config';
import { BASE_PATH, MOSAIC_ROUTE, LOGIN_ROUTE } from '../util/url';
import { AppBase } from './app-base';
import './app.css';
import { AuthenticatorContext, UserContext } from './auth/contexts';
import Login from './auth/login';
import PrivateRoute from './auth/private-route';
import { User } from './auth/user';
import Dashboard from './dashboard/dashboard';
import NotFoundPage from './error-pages/page-not-found';
import LayoutManager from './layout-manager/layout-manager';
import { RmfApp } from './rmf-app';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#44497a',
      dark: '#323558',
      light: '#565d99',
    },
  },
});

function AppIntrinsics(props: React.PropsWithChildren<{}>): JSX.Element {
  const user = React.useContext(UserContext);
  return user ? (
    <AppBase>
      <RmfApp>{props.children}</RmfApp>
    </AppBase>
  ) : (
    <>{props.children}</>
  );
}

export default function App(): JSX.Element | null {
  const [authInitialized, setAuthInitialized] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const authenticator = appConfig.authenticator;

  React.useEffect(() => {
    (async () => {
      authenticator.on('userChanged', (newUser) => setUser(newUser));
      await authenticator.init();
      setUser(authenticator.user || null);
      setAuthInitialized(true);
    })();
  }, [authenticator]);

  return authInitialized ? (
    <AuthenticatorContext.Provider value={authenticator}>
      <UserContext.Provider value={user}>
        <ThemeProvider theme={theme}>
          <AppIntrinsics>
            <BrowserRouter>
              <Switch>
                <Route exact={true} path={LOGIN_ROUTE}>
                  <Login />
                </Route>
                <PrivateRoute exact={true} path={BASE_PATH}>
                  <Dashboard />
                </PrivateRoute>
                <PrivateRoute exact={true} path={MOSAIC_ROUTE}>
                  <LayoutManager />
                </PrivateRoute>
                <Route component={NotFoundPage} />
              </Switch>
            </BrowserRouter>
          </AppIntrinsics>
        </ThemeProvider>
      </UserContext.Provider>
    </AuthenticatorContext.Provider>
  ) : null;
}
