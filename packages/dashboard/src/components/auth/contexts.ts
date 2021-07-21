import { Permission, User as ApiUser } from 'api-client';
import React from 'react';
import appConfig from '../../app-config';

export type UserProfile = ApiUser;

export interface User {
  profile: UserProfile;
  permissions: Permission[];
}

export const AuthenticatorContext = React.createContext(appConfig.authenticator);
export const UserContext = React.createContext<User | null>(null);
