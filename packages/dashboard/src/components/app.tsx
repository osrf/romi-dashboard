import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { NotFoundPage } from 'react-components';
import { BrowserRouter, Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { getUrl, LoginHOC, PrivateRouteHOC } from 'rmf-auth';
import appConfig from '../app-config';
import ResourceManager from '../managers/resource-manager';
import { ADMIN_ROUTE, DASHBOARD_ROUTE, LOGIN_ROUTE, ROBOTS_ROUTE, TASKS_ROUTE } from '../util/url';
import { AppBase } from './app-base';
import { AppConfigContext, ResourcesContext, TrajectorySocketContext } from './app-contexts';
import './app.css';
import { TabValue } from './appbar';
import { AuthenticatorContext } from './auth/contexts';
import Dashboard from './dashboard/dashboard';
import { RmfApp } from './rmf-app';
import { RobotPage } from './robots';
import { TaskPage } from './tasks';

const PrivateRoute = PrivateRouteHOC(Route, Redirect, useLocation);
const Login = LoginHOC(Redirect);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#44497a',
      dark: '#323558',
      light: '#565d99',
    },
  },
});

function locationToTabValue(pathname: string): TabValue | null {
  switch (pathname) {
    case DASHBOARD_ROUTE:
      return 'building';
    case TASKS_ROUTE:
      return 'tasks';
    case ROBOTS_ROUTE:
      return 'robots';
    case ADMIN_ROUTE:
      return 'admin';
    default:
      return null;
  }
}

export default function App(): JSX.Element | null {
  const [authInitialized, setAuthInitialized] = React.useState(!!appConfig.authenticator.user);
  const [authenticator, setAuthenticator] = React.useState(appConfig.authenticator);
  const [user, setUser] = React.useState<string | null>(null);
  const [ws, setWs] = React.useState<WebSocket>(new WebSocket(appConfig.trajServerUrl));
  const appRoutes = [DASHBOARD_ROUTE, TASKS_ROUTE, ROBOTS_ROUTE, ADMIN_ROUTE];
  const [tabValue, setTabValue] = React.useState<TabValue | null>(() =>
    locationToTabValue(window.location.pathname),
  );

  const onTabChange = React.useCallback(
    (_ev: React.ChangeEvent<unknown>, newValue: TabValue) => setTabValue(newValue),
    [],
  );

  const onTokenExpired = () => setAuthenticator(appConfig.authenticator);
  authenticator.on('tokenRefresh', onTokenExpired);

  React.useEffect(() => {
    setWs(new WebSocket(appConfig.trajServerUrl));
  }, [setWs]);

  React.useEffect(() => {
    let cancel = false;
    const onUserChanged = (newUser: string | null) => setUser(newUser);
    authenticator.on('userChanged', onUserChanged);
    (async () => {
      await authenticator.init();
      if (cancel) {
        return;
      }
      setUser(authenticator.user || null);
      setAuthInitialized(true);
    })();
    return () => {
      cancel = true;
      authenticator.off('userChanged', onUserChanged);
    };
  }, [authenticator]);

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
          <TrajectorySocketContext.Provider value={ws}>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <Switch>
                  <Route exact path={LOGIN_ROUTE}>
                    <Login
                      user={user}
                      title={'Dashboard'}
                      authenticator={authenticator}
                      successRedirectUri={getUrl(DASHBOARD_ROUTE)}
                    />
                  </Route>
                  {/* FIXME: Might not need this anymore after we changed to let each page control
                  which topics to subscribe instead of a global context subscribing to everything.

                  we need this because we don't want to re-mount `AppIntrinsics` when just moving
                  from one route to another, but we want to unmount it when going "outside" the app. */}
                  {tabValue ? (
                    <PrivateRoute exact path={appRoutes} redirectPath={LOGIN_ROUTE} user={user}>
                      <RmfApp>
                        <AppBase appbarProps={{ tabValue, onTabChange }}>
                          <Switch>
                            <PrivateRoute
                              exact
                              path={DASHBOARD_ROUTE}
                              redirectPath={LOGIN_ROUTE}
                              user={user}
                            >
                              <Dashboard />
                            </PrivateRoute>
                            <PrivateRoute
                              exact
                              path={ROBOTS_ROUTE}
                              redirectPath={LOGIN_ROUTE}
                              user={user}
                            >
                              <RobotPage />
                            </PrivateRoute>
                            <PrivateRoute
                              exact
                              path={TASKS_ROUTE}
                              redirectPath={LOGIN_ROUTE}
                              user={user}
                            >
                              <TaskPage />
                            </PrivateRoute>
                          </Switch>
                          {tabValue === 'building' && <Redirect to={DASHBOARD_ROUTE} />}
                          {tabValue === 'robots' && <Redirect to={ROBOTS_ROUTE} />}
                          {tabValue === 'tasks' && <Redirect to={TASKS_ROUTE} />}
                        </AppBase>
                      </RmfApp>
                    </PrivateRoute>
                  ) : (
                    <Route>
                      <NotFoundPage
                        routeLinkComponent={<Link to={LOGIN_ROUTE}>Go to Login</Link>}
                      />
                    </Route>
                  )}
                </Switch>
              </BrowserRouter>
            </ThemeProvider>
          </TrajectorySocketContext.Provider>
        </AuthenticatorContext.Provider>
      </ResourcesContext.Provider>
    </AppConfigContext.Provider>
  ) : null;
}
