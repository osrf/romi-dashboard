import { Snackbar } from '@material-ui/core';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';

export interface NotificationBarProps {
  message: string | undefined | null;
  type: AlertProps['severity']; // error | warning | info | success
  time?: string; // milliseconds
}

const NotificationBar = (props: NotificationBarProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const { message, type } = props;

  useEffect(() => {
    if (!!message) {
      setShowAlert(true);
    }
  }, [message]);

  const onMessageClose = () => {
    setShowAlert(false);
  };

  return (
    <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => onMessageClose()}>
      <Alert onClose={() => onMessageClose()} severity={type ? type : 'error'}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationBar;
