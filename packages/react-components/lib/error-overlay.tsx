import React from 'react';
import { makeStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  errorIcon: {
    color: theme.palette.error.main,
    fontSize: '2rem',
  },
  errorMsg: {
    margin: '0.5rem',
  },
  errorDisabled: {
    pointerEvents: 'none',
    filter: 'blur(.25rem)',
    gridArea: '1 / 1',
    opacity: 0.6,
  },
  overlay: {
    gridArea: '1 / 1',
    backdropFilter: 'blur(.5rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'grid',
  },
  disableSelect: {
    userSelect: 'none',
  },
}));

export interface ErrorOverlayProps {
  errorMsg?: string | null;
  children: React.ReactNode | null;
  overrideErrorStyle?: string;
}

export const ErrorOverlay = React.memo(
  (props: ErrorOverlayProps): JSX.Element => {
    const classes = useStyles();
    const { errorMsg, children, overrideErrorStyle } = props;

    return errorMsg ? (
      <div className={classes.container}>
        <div className={classes.errorDisabled}>{children}</div>
        <div
          className={
            children ? `${classes.overlay} ${classes.disableSelect}` : classes.disableSelect
          }
        >
          <div>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item>
                <ErrorIcon className={classes.errorIcon} />
              </Grid>
              <Grid item>
                <Typography color="error" variant="h4" align="center">
                  Error
                </Typography>
              </Grid>
            </Grid>
            <Typography
              className={overrideErrorStyle ? overrideErrorStyle : classes.errorMsg}
              color="error"
              variant="h6"
              align="center"
            >
              {errorMsg}
            </Typography>
          </div>
        </div>
      </div>
    ) : (
      <React.Fragment>{children}</React.Fragment>
    );
  },
);
