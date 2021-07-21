import Debug from 'debug';
import React from 'react';
import { RouteProps } from 'react-router-dom';

const debug = Debug('PrivateRoute');

export interface PrivateRouteBaseProps extends React.PropsWithChildren<RouteProps> {
  // if true, do not redirect to login url if not authenticated
  noRedirectToLogin?: boolean;
  unauthorized?: React.ReactElement | null;
  user?: string | null;
  redirect: React.ReactElement;
}

/**
 * This component validates if the user is authenticated before rendering component passed as a
 * prop.
 */
export const PrivateRouteBase = ({
  noRedirectToLogin,
  children,
  unauthorized,
  redirect,
  user,
}: PrivateRouteBaseProps): React.ReactElement | null => {
  function render() {
    if (user) {
      return children;
    } else {
      if (!noRedirectToLogin) {
        debug('accessing private route while unauthenticated');
        debug('redirecting to login page');
        return redirect;
      } else {
        return unauthorized ? unauthorized : <span>Unauthorized</span>;
      }
    }
  }

  return <>{render()}</>;
};

export default PrivateRouteBase;
