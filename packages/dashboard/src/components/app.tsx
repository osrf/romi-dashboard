import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'typeface-roboto';
import appConfig from '../app-config';
import { DASHBOARD_ROUTE, GRID_ROUTE, LOGIN_ROUTE } from '../util/url';
import './app.css';
import { AuthenticatorContext, UserContext } from './auth/contexts';
import Login from './auth/login';
import PrivateRoute from './auth/private-route';
import { User } from './auth/user';
import Dashboard from './dashboard';
import NotFoundPage from './error-pages/page-not-found';
import Grid from './grid';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#44497a',
      dark: '#323558',
      light: '#565d99',
    },
  },
});

export default function App(): React.ReactElement {
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
          <BrowserRouter>
            <Switch>
              <Route exact={true} path={LOGIN_ROUTE}>
                <Login />
              </Route>
              <PrivateRoute exact={true} path={DASHBOARD_ROUTE}>
                <Dashboard />
              </PrivateRoute>
              <PrivateRoute exact={true} path={GRID_ROUTE}>
                <Grid />
              </PrivateRoute>
              <Route component={NotFoundPage} />
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </UserContext.Provider>
    </AuthenticatorContext.Provider>
  ) : (
    <></>
  );
}
