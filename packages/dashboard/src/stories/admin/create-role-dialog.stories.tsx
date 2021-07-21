import { Meta, Story } from '@storybook/react';
import React from 'react';
import { CreateRoleDialog, CreateRoleDialogProps } from '../../components/admin/create-role-dialog';

export default {
  title: 'Admin/Add Role Dialog',
  component: CreateRoleDialog,
} as Meta;

export const Default: Story<CreateRoleDialogProps> = (args) => {
  return (
    <CreateRoleDialog
      {...args}
      open={true}
      createRole={() => new Promise((res) => setTimeout(res, 500))}
    />
  );
};

Default.storyName = 'Add Role Dialog';
