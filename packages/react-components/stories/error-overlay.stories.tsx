import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ErrorOverlay, SimpleInfo } from '../lib';
import { makeStyles } from '@material-ui/core';

export default {
  title: 'Error Overlay',
  component: ErrorOverlay,
} as Meta;

export const ErrorOverlayPanel: Story = (args) => {
  // override style with userSelect disabled
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'table',
      borderCollapse: 'collapse',
      width: '100%',
      overflowX: 'auto',
      userSelect: 'none',
      backgroundColor: theme.palette.background.paper,
    },
  }));
  const classes = useStyles();

  function TestComponent() {
    const data = [
      { name: 'String', value: 'This is a string' },
      { name: 'Number', value: 3 },
      {
        name: 'Array',
        value: ['one', 'two', 'three'],
      },
    ];
    return <SimpleInfo infoData={data} overrideStyle={classes} />;
  }

  return (
    <>
      <ErrorOverlay errorMsg={'This is an error message'} {...args}>
        <TestComponent />
      </ErrorOverlay>
    </>
  );
};
