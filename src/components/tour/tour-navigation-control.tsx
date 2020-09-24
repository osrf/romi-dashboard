import React from 'react';
import { Box, Button, createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@material-ui/icons';

interface NavButtonProps {
  goTo: Function;
  step: number;
  handleNextClick?: () => void;
  handleBackClick?: () => void;
  lastStep?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      color: theme.palette.info.contrastText,
    },
  }),
);

export const NavButtons = React.memo((props: NavButtonProps) => {
  const { goTo, step, handleNextClick, handleBackClick, lastStep } = props;
  const classes = useStyles();
  return (
    <Box>
      {step > 1 && (
        <IconButton
          onClick={() => {
            if (handleBackClick) {
              handleBackClick();
            }
            goTo(step - 2);
          }}
          id="tour-back-btn"
        >
          <NavigateBeforeIcon className={classes.navigation} />
        </IconButton>
      )}
      {!lastStep && (
        <IconButton
          onClick={() => {
            if (handleNextClick) {
              handleNextClick();
            }
            setTimeout(() => goTo(step), 5);
          }}
          id="tour-next-btn"
        >
          <NavigateNextIcon className={classes.navigation} />
        </IconButton>
      )}
      {lastStep && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (handleNextClick) {
              handleNextClick();
            }
            localStorage.setItem('tourComplete', 'true');
          }}
          id="tour-last-step-btn"
        >
          Start Using Romi
        </Button>
      )}
    </Box>
  );
});
