import { Meta, Story } from '@storybook/react';
import React from 'react';
import { CreateUserDialog, CreateUserDialogProps } from '../../components/admin/create-user-dialog';

export default {
  title: 'Admin/Add User Dialog',
  component: CreateUserDialog,
} as Meta;

export const Default: Story<CreateUserDialogProps> = (args) => {
  return (
    <CreateUserDialog
      {...args}
      open={true}
      createUser={() => new Promise((res) => setTimeout(res, 500))}
    />
  );
};

Default.storyName = 'Add User Dialog';
