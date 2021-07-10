import { Meta, Story } from '@storybook/react';
import React from 'react';
import { SimpleInfo } from '../lib';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

export default {
  title: 'Simple Info',
  argTypes: {
    stringDisplayName: {
      name: 'String Display Name',
    },
    stringValue: {
      name: 'String Value',
    },
    numberDisplayName: {
      name: 'Number Display Name',
    },
    numberValue: {
      name: 'Number Value',
    },
  },
} as Meta;

export const SimpleData: Story = ({
  stringDisplayName,
  stringValue,
  numberDisplayName,
  numberValue,
  ...args
}) => {
  return (
    <div className={useStyles().background}>
      <SimpleInfo
        infoData={[
          { name: stringDisplayName, value: stringValue },
          { name: numberDisplayName, value: numberValue },
        ]}
        {...args}
      />
    </div>
  );
};
SimpleData.args = {
  stringDisplayName: 'string',
  stringValue: 'value',
  numberDisplayName: 'number',
  numberValue: 0,
};

export const Array: Story = (args) => {
  return (
    <div className={useStyles().background}>
      <SimpleInfo infoData={[{ name: 'strings', value: ['hello', 'world'] }]} {...args} />
    </div>
  );
};
