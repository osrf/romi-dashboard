import { Meta, Story } from '@storybook/react';
import React from 'react';
import {
  AddPermissionDialog,
  AddPermissionDialogProps,
} from '../../components/admin/add-permission-dialog';

export default {
  title: 'Admin/Add Permission Dialog',
  component: AddPermissionDialog,
} as Meta;

export const Default: Story<AddPermissionDialogProps> = (args) => {
  return (
    <AddPermissionDialog
      {...args}
      open={true}
      setOpen={() => {}}
      savePermission={() => new Promise((res) => setTimeout(res, 500))}
    />
  );
};

Default.storyName = 'Add Permission Dialog';
