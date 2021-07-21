/* istanbul ignore file */

import { Snackbar } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import React from 'react';
import { RmfIngressContext } from '../rmf-app';
import { getApiErrorMessage } from '../utils';
import { usePageStyles } from './page-css';
import { UserListCard } from './user-list-card';

export function UserListPage(): JSX.Element {
  const classes = usePageStyles();
  const rmfIngress = React.useContext(RmfIngressContext);
  const adminApi = rmfIngress && rmfIngress.adminApi;
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertProps['severity']>('error');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  return (
    <div className={classes.pageRoot}>
      <UserListCard
        searchUsers={
          adminApi &&
          (async (search, limit, offset) => {
            const results = await adminApi.getUsersAdminUsersGet(search, undefined, limit, offset);
            if (results.status !== 200) {
              return [];
            }
            return results.data;
          })
        }
        deleteUser={
          adminApi &&
          (async (user) => {
            const results = await adminApi.deleteUserAdminUsersUsernameDelete(user);
            if (results.status !== 200) {
              const errMsg = getApiErrorMessage(results);
              setSnackbarMessage(`Failed to delete user: ${errMsg}`);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              throw new Error(errMsg);
            }
          })
        }
        createUser={
          adminApi &&
          (async (user) => {
            const results = await adminApi.createUserAdminUsersPost({ username: user });
            if (results.status !== 200) {
              const errMsg = getApiErrorMessage(results);
              setSnackbarMessage(`Failed to create user: ${errMsg}`);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              throw new Error(errMsg);
            }
          })
        }
      />
      <Snackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} autoHideDuration={2000}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
}
