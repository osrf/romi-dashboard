import { Meta, Story } from '@storybook/react';
import React from 'react';
import { ManageRolesCard } from '../../components/admin/manage-roles-dialog';
import { RoleListCardProps } from '../../components/admin/role-list-card';

export default {
  title: 'Admin/Manage Roles Card',
} as Meta;

const allRoles: string[] = [];
for (let i = 0; i < 5; i++) {
  allRoles.push(`role${i}`);
}

export const Default: Story<RoleListCardProps> = (args) => {
  return (
    <ManageRolesCard
      assignedRoles={['role1']}
      getAllRoles={async () => {
        await new Promise((res) => setTimeout(res, 500));
        return allRoles;
      }}
      saveRoles={async () => {
        await new Promise((res) => setTimeout(res, 500));
      }}
      {...args}
    />
  );
};

Default.storyName = 'Manage Roles Card';
