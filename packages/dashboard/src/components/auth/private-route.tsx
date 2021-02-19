import Debug from 'debug';
import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';
import { LOGIN_ROUTE } from '../../util/url';
import Unauthorized from '../error-pages/unauthorized';
import { UserContext } from './contexts';

const debug = Debug('PrivateRoute');

export interface PrivateRouteProps extends React.PropsWithChildren<RouteProps> {
  // if true, do not redirect to login url if not authenticated
  noRedirectToLogin?: boolean;
}

/**
 * This component validates if the user is authenticated before rendering component passed as a
 * prop.
 */
const PrivateRoute = ({
  noRedirectToLogin,
  children,
  ...rest
}: PrivateRouteProps): JSX.Element | null => {
  const user = React.useContext(UserContext);
  const location = useLocation();

  function render() {
    if (user) {
      return children;
    } else {
      if (!noRedirectToLogin) {
        debug('accessing private route while unauthenticated');
        debug('redirecting to login page');
        return <Redirect to={{ pathname: LOGIN_ROUTE, state: { from: location } }} />;
      } else {
        return <Unauthorized />;
      }
    }
  }

  return <Route {...rest}>{render()}</Route>;
};

export default PrivateRoute;
