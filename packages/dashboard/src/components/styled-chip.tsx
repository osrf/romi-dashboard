import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { red, blue, teal, cyan } from '@material-ui/core/colors';

interface StyledChipProps {
  state: string;
}

const useStyles = (bgCol: string) =>
  makeStyles({
    root: {
      background: bgCol,
      color: 'white',
      height: 24,
      verticalAlign: 'middle',
    },
  })();

const returnChipColor = (state: string): string => {
  switch (state) {
    case 'Code Blue':
      return blue[500];
    case 'Code Red':
      return red[400];
    case 'No Emergency':
      return teal[500];
  }
  return cyan[500];
};

const StyledChip = (props: StyledChipProps): ReactElement => {
  const { state } = props;
  const classes = useStyles(returnChipColor(state));

  return <Chip classes={{ root: classes.root }} label={state} />;
};

export default StyledChip;
