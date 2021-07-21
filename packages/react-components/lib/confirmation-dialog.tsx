import {
  Button,
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Loading } from './loading';

const useStyles = makeStyles({
  title: {
    flex: '1 1 auto',
  },
  actionBtn: {
    minWidth: 80,
  },
});

export interface ConfirmationDialogProps extends DialogProps {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  // disable the dialog actions and shows a loading indicator
  loading?: boolean;
  classes?: DialogActionsProps['classes'] & { button: string };
  toolbar?: React.ReactNode;
  onSubmit?: React.FormEventHandler;
  onCancelClick?: React.MouseEventHandler;
}

export function ConfirmationDialog({
  title = 'Confirm',
  confirmText = 'OK',
  cancelText = 'Cancel',
  loading = false,
  classes,
  onSubmit,
  onCancelClick,
  toolbar,
  children,
  ...otherProps
}: ConfirmationDialogProps): JSX.Element {
  const myClasses = useStyles();
  return (
    <Dialog {...otherProps}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmit && onSubmit(ev);
        }}
        aria-label="form"
      >
        <DialogTitle>
          <Grid container wrap="nowrap">
            <Grid item className={myClasses.title}>
              {title}
            </Grid>
            <Grid item>{toolbar}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            aria-label={cancelText}
            onClick={onCancelClick}
            disabled={loading}
            className={clsx(myClasses.actionBtn, classes?.button)}
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            aria-label={confirmText}
            disabled={loading}
            className={clsx(myClasses.actionBtn, classes?.button)}
          >
            <Loading hideChildren loading={loading} size="1.5em" color="inherit">
              {confirmText}
            </Loading>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
