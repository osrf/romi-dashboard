import { Meta, Story } from '@storybook/react';
import React from 'react';
import { UserProfileCard } from '../../components/admin/user-profile';

export default {
  title: 'Admin/User Profile Card',
  component: UserProfileCard,
  argTypes: {
    username: {
      control: {
        type: 'text',
      },
      defaultValue: 'Example',
    },
    isAdmin: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    roles: {
      control: {
        type: 'object',
      },
      defaultValue: [],
    },
  },
  parameters: {
    controls: {
      include: ['username', 'isAdmin', 'roles'],
    },
  },
} as Meta;

export interface StoryArgs {
  username: string;
  isAdmin: boolean;
  roles: string[];
}

export const Default: Story<StoryArgs> = (args) => {
  return (
    <UserProfileCard
      profile={{ username: args.username, is_admin: args.isAdmin, roles: args.roles }}
    ></UserProfileCard>
  );
};

Default.storyName = 'User Profile Card';
