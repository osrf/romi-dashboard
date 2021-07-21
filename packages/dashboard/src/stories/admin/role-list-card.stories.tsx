import { Meta, Story } from '@storybook/react';
import React from 'react';
import { RoleListCard, RoleListCardProps } from '../../components/admin/role-list-card';
import { RmfAction } from '../../components/permissions';

export default {
  title: 'Admin/Role List Card',
  component: RoleListCard,
  argTypes: {
    roles: {
      defaultValue: ['role4', 'role2', 'role3', 'role1'],
    },
  },
} as Meta;

export const Default: Story<RoleListCardProps> = (args) => {
  return (
    <RoleListCard
      {...args}
      getPermissions={async () => {
        await new Promise((res) => setTimeout(res, 500));
        return [
          { action: RmfAction.TaskCancel, authz_grp: 'group1' },
          { action: RmfAction.TaskRead, authz_grp: 'group1' },
        ];
      }}
      createRole={() => new Promise((res) => setTimeout(res, 500))}
    />
  );
};

Default.storyName = 'Role List Card';
