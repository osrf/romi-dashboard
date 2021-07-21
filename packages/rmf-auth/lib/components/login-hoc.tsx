import React from 'react';
import { Authenticator, LoginBase } from '..';
import { Redirect } from 'react-router-dom';

export interface LoginProps {
  user: string | null;
  authenticator: Authenticator;
  successRedirectUri: string;
  title: string;
}

// Redirect is not working if use a component from a different package, so we are using a HOC to wrap the Redirect

export const LoginHOC = (RedirectComponent: typeof Redirect) => {
  return function LoginTest(props: LoginProps): JSX.Element {
    const { user, authenticator, successRedirectUri, title } = props;
    return user ? (
      <RedirectComponent to={successRedirectUri} />
    ) : (
      <LoginBase
        authenticator={authenticator}
        title={title}
        successRedirectUri={successRedirectUri}
      />
    );
  };
};
