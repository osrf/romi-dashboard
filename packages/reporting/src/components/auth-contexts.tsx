import React from 'react';
import appConfig from '../app-config';

export const AuthenticatorContext = React.createContext(appConfig.authenticator);
export const UserContext = React.createContext<string | null>(null);
