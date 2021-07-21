import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { PrivateRouteBase } from '..';

export interface PrivateRouteProps extends React.PropsWithChildren<RouteProps> {
  // if true, do not redirect to login url if not authenticated
  noRedirectToLogin?: boolean;
  redirectPath: string;
  unauthorized?: React.ReactElement | null;
  user: string | null;
}

export const PrivateRouteHOC = (
  RouteComponent: typeof Route,
  RedirectComponent: typeof Redirect,
  hookUseLocation: typeof useLocation,
) => {
  return ({
    noRedirectToLogin,
    children,
    redirectPath,
    unauthorized,
    user,
    ...rest
  }: PrivateRouteProps): JSX.Element => {
    const location = hookUseLocation();
    const redirect = (
      <RedirectComponent to={{ pathname: redirectPath, state: { from: location } }} />
    );
    return (
      <RouteComponent {...rest}>
        <PrivateRouteBase
          user={user}
          noRedirectToLogin={noRedirectToLogin}
          unauthorized={unauthorized}
          redirect={redirect}
        >
          {children}
        </PrivateRouteBase>
      </RouteComponent>
    );
  };
};

export default PrivateRouteHOC;
