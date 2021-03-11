import { Divider, makeStyles, Grid, Typography, IconButton } from '@material-ui/core';
import { KeyboardBackspace as BackIcon } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

interface DrawerHeaderProps {
  handleCloseButton(): void;
  handleBackButton?(): void;
  title: string;
}

const DrawerHeader = (props: DrawerHeaderProps) => {
  const { handleBackButton, handleCloseButton, title } = props;
  const classes = useStyles();

  return (
    <>
      {handleBackButton && (
        <Grid item>
          <IconButton
            data-testid="backDrawerButton"
            id="backDrawerButton"
            className={classes.button}
            onClick={handleBackButton}
          >
            <BackIcon />
          </IconButton>
        </Grid>
      )}
      <Grid container alignItems="center">
        <Grid item className={classes.heading}>
          <Typography variant="h6">{title}</Typography>
        </Grid>

        {handleCloseButton && (
          <Grid item>
            <IconButton
              data-testid="closeDrawerButton"
              id="backDrawerButton"
              className={classes.button}
              onClick={handleCloseButton}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <Divider />
    </>
  );
};

export default DrawerHeader;

const useStyles = makeStyles((theme) => ({
  heading: {
    margin: '0 auto 0 calc(50% - 3rem)',
  },
  button: {
    width: '3rem',
  },
}));
