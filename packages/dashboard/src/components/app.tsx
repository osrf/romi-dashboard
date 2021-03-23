import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'typeface-roboto';
import appConfig from '../app-config';
import ResourceManager from '../managers/resource-manager';
import { DASHBOARD_ROUTE, LOGIN_ROUTE, MOSAIC_ROUTE } from '../util/url';
import { AppBase } from './app-base';
import { ResourcesContext, AppConfigContext } from './app-contexts';
import './app.css';
import { AuthenticatorContext, UserContext } from './auth/contexts';
import Login from './auth/login';
import PrivateRoute from './auth/private-route';
import { User } from './auth/user';
import Dashboard from './dashboard/dashboard';
import NotFoundPage from './error-pages/page-not-found';
import { RmfApp } from './rmf-app';
import LayoutManager from './layout-manager/layout-manager';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#44497a',
      dark: '#323558',
      light: '#565d99',
    },
  },
});

function AppIntrinsics({ children }: React.PropsWithChildren<{}>): JSX.Element | null {
  return (
    <AppBase>
      <RmfApp>{children}</RmfApp>
    </AppBase>
  );
}

export default function App(): JSX.Element | null {
  const authenticator = appConfig.authenticator;
  const [authInitialized, setAuthInitialized] = React.useState(!!authenticator.user);
  const [user, setUser] = React.useState<User | null>(authenticator.user || null);
  const appRoutes = [DASHBOARD_ROUTE, MOSAIC_ROUTE];

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

  const resourceManager = React.useRef<ResourceManager | undefined>(undefined);
  const [appReady, setAppReady] = React.useState(false);

  /**
   * If resource loading gets too long we should add a loading screen.
   */
  React.useEffect(() => {
    (async () => {
      const appResources = await appConfig.appResourcesFactory();
      if (!appResources) {
        setAppReady(true);
      } else {
        resourceManager.current = appResources;
        setAppReady(true);
      }
    })();
  }, []);

  return authInitialized && appReady ? (
    <AppConfigContext.Provider value={appConfig}>
      <ResourcesContext.Provider value={resourceManager.current}>
        <AuthenticatorContext.Provider value={authenticator}>
          <UserContext.Provider value={user}>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <Switch>
                  <Route exact path={LOGIN_ROUTE}>
                    <Login />
                  </Route>
                  {/* we need this because we don't want to re-mount `AppIntrinsics` when just moving
                  from one route to another, but we want to unmount it when going "outside" the app. */}
                  <PrivateRoute exact path={appRoutes}>
                    <AppIntrinsics>
                      <Switch>
                        <PrivateRoute exact path={DASHBOARD_ROUTE}>
                          <Dashboard />
                        </PrivateRoute>
                        <PrivateRoute exact path={MOSAIC_ROUTE}>
                          <LayoutManager />
                        </PrivateRoute>
                      </Switch>
                    </AppIntrinsics>
                  </PrivateRoute>
                  <Route>
                    <NotFoundPage />
                  </Route>
                </Switch>
              </BrowserRouter>
            </ThemeProvider>
          </UserContext.Provider>
        </AuthenticatorContext.Provider>
      </ResourcesContext.Provider>
    </AppConfigContext.Provider>
  ) : null;
}
