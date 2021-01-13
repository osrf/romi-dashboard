import { Story } from '@storybook/react';
import React from 'react';
import { LayoutManager } from '../lib';

export default {
  title: 'Layout Manager',
};

export const LayoutManagerPanel: Story = (args) => {
  return <LayoutManager {...args} />;
};
