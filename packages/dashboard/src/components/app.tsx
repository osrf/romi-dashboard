import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { LoginHOC, PrivateRouteHOC } from 'rmf-auth';
import appConfig from '../app-config';
import ResourceManager from '../managers/resource-manager';
import { AdminRoute, DashboardRoute, LoginRoute, RobotsRoute, TasksRoute } from '../util/url';
import { UserListPage } from './admin';
import { AppBase } from './app-base';
import { ResourcesContext } from './app-contexts';
import './app.css';
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

export default function App(): JSX.Element | null {
  const authenticator = appConfig.authenticator;
  const [authInitialized, setAuthInitialized] = React.useState(!!appConfig.authenticator.user);
  const [user, setUser] = React.useState<string | null>(null);

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
              <AppBase>
                <Switch>
                  <Route exact path={LoginRoute}>
                    <Redirect to={DashboardRoute} />
                  </Route>
                  <PrivateRoute exact path={DashboardRoute} redirectPath={LoginRoute} user={user}>
                    <Dashboard />
                  </PrivateRoute>
                  <PrivateRoute exact path={RobotsRoute} redirectPath={LoginRoute} user={user}>
                    <RobotPage />
                  </PrivateRoute>
                  <PrivateRoute exact path={TasksRoute} redirectPath={LoginRoute} user={user}>
                    <TaskPage />
                  </PrivateRoute>
                  <PrivateRoute path={AdminRoute} redirectPath={LoginRoute} user={user}>
                    <UserListPage />
                  </PrivateRoute>
                  <PrivateRoute redirectPath={LoginRoute} user={user}>
                    <Redirect to={DashboardRoute} />
                  </PrivateRoute>
                </Switch>
              </AppBase>
            </RmfApp>
          ) : (
            <Switch>
              <Route exact path={LoginRoute}>
                <Login
                  user={user}
                  title={'Dashboard'}
                  authenticator={authenticator}
                  successRedirectUri={`${window.location.origin}${DashboardRoute}`}
                />
              </Route>
              <Route>
                <Redirect to={LoginRoute} />
              </Route>
            </Switch>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </ResourcesContext.Provider>
  ) : null;
}
