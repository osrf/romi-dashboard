import { Card, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountIcon from '@material-ui/icons/AccountCircle';
import React from 'react';
import { UserProfile } from '../auth';

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[600],
    fontSize: '3em',
  },
}));

export interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps): JSX.Element {
  const classes = useStyles();
  return (
    <Card variant="outlined">
      <CardHeader
        title={profile.username}
        titleTypographyProps={{ variant: 'h5' }}
        subheader={profile.is_admin ? 'Admin' : 'User'}
        avatar={<AccountIcon className={classes.avatar} />}
      />
    </Card>
  );
}
