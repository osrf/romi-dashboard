import { Meta, Story } from '@storybook/react';
import React from 'react';
import { AdminDrawer, AdminDrawerProps } from '../../components/admin/drawer';

export default {
  title: 'Admin/Drawer',
  component: AdminDrawer,
  argTypes: {
    active: {
      defaultValue: 'Users',
    },
  },
} as Meta;

export const Default: Story<AdminDrawerProps> = (args) => {
  return <AdminDrawer {...args} />;
};

Default.storyName = 'Drawer';
