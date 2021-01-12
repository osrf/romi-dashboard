import { Button } from '@material-ui/core';
import React from 'react';
import { LoginPage } from 'react-components';
import { Redirect } from 'react-router';
import { BASE_PATH } from '../../util/url';
import { AuthenticatorContext, UserContext } from '../auth/contexts';

export default function Login(): React.ReactElement {
  const authenticator = React.useContext(AuthenticatorContext);
  const user = React.useContext(UserContext);

  async function handleRmfLogin(_event: React.MouseEvent): Promise<void> {
    authenticator.login();
  }

  return user ? (
    <Redirect to={BASE_PATH} />
  ) : (
    <LoginPage title="RoMi Dashboard" logo="assets/ros-health.png">
      <Button id="login-button" onClick={handleRmfLogin} variant="contained">
        Login with RMF
      </Button>
    </LoginPage>
  );
}
