import React from 'react';
import { TextField, makeStyles, Divider, withStyles } from '@material-ui/core';

export interface OnChangeEvent {
  name?: string | undefined;
  value: string;
}

export interface SimpleFilterProps {
  onChange?: (e: React.ChangeEvent<OnChangeEvent>) => void;
  value: string;
}

const CustomTextField = withStyles((theme) => ({
  root: {
    '& label': {
      color: theme.palette.success.main,
    },
    '& label.Mui-focused': {
      color: '#A8A8A8',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#A8A8A8',
    },
    '& .MuiOutlinedInput-root': {
      color: '#A8A8A8',
      '& fieldset': {
        borderColor: theme.palette.success.main,
      },
      '&:hover fieldset': {
        borderColor: '#868686',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#A8A8A8',
      },
    },
  },
}))(TextField);

const useStyles = makeStyles((theme) => ({
  simpleFilter: {
    margin: '1rem',
    borderColor: theme.palette.success.main,
  },
  filterBar: {
    width: '100%',
  },
  divider: {
    margin: '1.5rem 0',
  },
}));

export const SimpleFilter = (props: SimpleFilterProps): JSX.Element => {
  const classes = useStyles();

  const { onChange, value } = props;

  return (
    <div className={classes.simpleFilter}>
      <CustomTextField
        label="Filter"
        value={value}
        variant="outlined"
        onChange={onChange}
        className={classes.filterBar}
        aria-label="text-input"
        data-component="simple-filter"
      />
      <Divider className={classes.divider} />
    </div>
  );
};
