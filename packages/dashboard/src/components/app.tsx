import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { getUrl, LoginHOC, PrivateRouteHOC } from 'rmf-auth';
import appConfig from '../app-config';
import ResourceManager from '../managers/resource-manager';
import { ADMIN_ROUTE, DASHBOARD_ROUTE, LOGIN_ROUTE, ROBOTS_ROUTE, TASKS_ROUTE } from '../util/url';
import { AppBase } from './app-base';
import { ResourcesContext } from './app-contexts';
import './app.css';
import { TabValue } from './appbar';
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

function locationToTabValue(pathname: string): TabValue | undefined {
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
      return undefined;
  }
}

export default function App(): JSX.Element | null {
  const authenticator = appConfig.authenticator;
  const [authInitialized, setAuthInitialized] = React.useState(!!appConfig.authenticator.user);
  const [user, setUser] = React.useState<string | null>(null);
  const [tabValue, setTabValue] = React.useState<TabValue | undefined>(() =>
    locationToTabValue(window.location.pathname),
  );

  const onTabChange = React.useCallback(
    (_ev: React.ChangeEvent<unknown>, newValue: TabValue) => setTabValue(newValue),
    [],
  );

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
    <ResourcesContext.Provider value={resourceManager.current}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {user ? (
            <RmfApp>
              <AppBase appbarProps={{ tabValue, onTabChange }}>
                <Switch>
                  <Route exact path={LOGIN_ROUTE}>
                    <Redirect to={DASHBOARD_ROUTE} />
                  </Route>
                  <PrivateRoute exact path={DASHBOARD_ROUTE} redirectPath={LOGIN_ROUTE} user={user}>
                    <Dashboard />
                  </PrivateRoute>
                  <PrivateRoute exact path={ROBOTS_ROUTE} redirectPath={LOGIN_ROUTE} user={user}>
                    <RobotPage />
                  </PrivateRoute>
                  <PrivateRoute exact path={TASKS_ROUTE} redirectPath={LOGIN_ROUTE} user={user}>
                    <TaskPage />
                  </PrivateRoute>
                  <PrivateRoute redirectPath={LOGIN_ROUTE} user={user}>
                    <Redirect to={DASHBOARD_ROUTE} />
                  </PrivateRoute>
                </Switch>
                {tabValue === 'building' && <Redirect to={DASHBOARD_ROUTE} />}
                {tabValue === 'robots' && <Redirect to={ROBOTS_ROUTE} />}
                {tabValue === 'tasks' && <Redirect to={TASKS_ROUTE} />}
              </AppBase>
            </RmfApp>
          ) : (
            <Switch>
              <Route exact path={LOGIN_ROUTE}>
                <Login
                  user={user}
                  title={'Dashboard'}
                  authenticator={authenticator}
                  successRedirectUri={getUrl(DASHBOARD_ROUTE)}
                />
              </Route>
              <Route>
                <Redirect to={LOGIN_ROUTE} />
              </Route>
            </Switch>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </ResourcesContext.Provider>
  ) : null;
}
