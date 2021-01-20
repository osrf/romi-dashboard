import { Backdrop, CircularProgress, makeStyles, Typography, useTheme } from '@material-ui/core';
import { Check as SuccessIcon, ErrorOutline as ErrorIcon } from '@material-ui/icons';
import React from 'react';
import { joinClasses } from 'react-components/lib/css-utils';

export interface LoadingScreenProps extends React.PropsWithChildren<{}> {
  caption?: string;
  variant?: 'loading' | 'success' | 'error';
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: theme.zIndex.modal,
    height: '100%',
    position: 'static',
  },
  caption: {
    marginTop: theme.spacing(4),
  },
  childrenContainer: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  disabled: {
    pointerEvents: 'none',
    userSelect: 'none',
  },
}));

export default function LoadingScreen(props: LoadingScreenProps): JSX.Element {
  const { caption, children } = props;
  const theme = useTheme();
  const classes = useStyles();
  return (
    <>
      {caption && (
        <Backdrop className={classes.root} open={true}>
          {(props.variant === undefined || props.variant === 'loading') && (
            <CircularProgress size="8rem" />
          )}
          {props.variant === 'success' && (
            <SuccessIcon htmlColor={theme.palette.success.main} style={{ fontSize: '8rem' }} />
          )}
          {props.variant === 'error' && <ErrorIcon color="error" style={{ fontSize: '8rem' }} />}
          <Typography
            className={classes.caption}
            variant="button"
            style={{ color: theme.palette.getContrastText('#000000') }}
          >
            {props.caption}
          </Typography>
        </Backdrop>
      )}
      <div className={joinClasses(classes.childrenContainer, caption && classes.disabled)}>
        {children}
      </div>
    </>
  );
}
