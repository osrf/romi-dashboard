import { Button, Typography } from '@material-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Loading, LoadingProps } from './loading';

export default {
  title: 'Loading',
  component: Loading,
  argTypes: {
    loading: {
      defaultValue: false,
    },
  },
} as Meta;

export const LoadingButton: Story<LoadingProps> = (args) => {
  return (
    <>
      <Button variant="contained" disabled={args.loading}>
        <Loading {...args} size="1.5em">
          OK
        </Loading>
      </Button>
      <Typography style={{ marginTop: 8 }}>
        Use the storybook controls to change loading state
      </Typography>
    </>
  );
};
