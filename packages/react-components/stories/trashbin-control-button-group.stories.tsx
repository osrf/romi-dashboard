import { Story, Meta } from '@storybook/react';
import React from 'react';
import { TrashBinControlButtonGroup } from '../lib';

export default {
  title: 'Trashbin Control Button Group',
  component: TrashBinControlButtonGroup,
  argTypes: {
    fullWidth: { control: 'boolean' },
  },
} as Meta;

export const SimpleTrashBinControlButtonGroup: Story = (args) => (
  // add a background to visualize different theme colors properly
  <div style={{ backgroundColor: '#A8A8A8', padding: '1rem' }}>
    <TrashBinControlButtonGroup {...args} />
  </div>
);
