import { Permission, User as ApiUser } from 'api-client';
import React from 'react';

export type UserProfile = ApiUser;

export interface User {
  profile: UserProfile;
  permissions: Permission[];
}

export const UserContext = React.createContext<User | null>(null);
