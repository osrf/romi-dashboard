import { Story } from '@storybook/react';
import React from 'react';
import { MegaGrid } from '../lib';

export default {
  title: 'Mega Grid',
};

export const MegaGridPanel: Story = (args) => {
  return <MegaGrid {...args} />;
};
