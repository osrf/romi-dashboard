import { Button } from '@material-ui/core';
import React from 'react';
import { LoginPage } from 'react-components';
import { Redirect } from 'react-router';
import { DASHBOARD_ROUTE, getUrl } from '../../util/url';
import { AuthenticatorContext, UserContext } from '../auth/contexts';

export interface LoginProps {
  /**
   * defaults to url of `DASHBOARD_ROUTE`
   */
  successRedirectUri?: string;
}

export default function Login(props: LoginProps): JSX.Element {
  const successRedirectUri = props.successRedirectUri || getUrl(DASHBOARD_ROUTE);
  const authenticator = React.useContext(AuthenticatorContext);
  const user = React.useContext(UserContext);

  async function handleRmfLogin(_event: React.MouseEvent): Promise<void> {
    authenticator.login(successRedirectUri);
  }

  return user ? (
    <Redirect to={successRedirectUri} />
  ) : (
    <LoginPage title="RoMi Dashboard" logo="assets/ros-health.png">
      <Button id="login-button" onClick={handleRmfLogin} variant="contained">
        Login with RMF
      </Button>
    </LoginPage>
  );
}
