import React from 'react';
import { makeStyles, Typography, Card, CardHeader, Avatar } from '@material-ui/core';

export interface MainMenuBannerProps {
  bannerUrl: string;
  isError: boolean;
}

const useStyles = makeStyles((theme) => ({
  heading: {
    color: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  noError: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.warning.main,
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[100],
  },
}));

export const MainMenuBanner = (props: MainMenuBannerProps): JSX.Element => {
  const classes = useStyles();
  const { bannerUrl, isError } = props;

  const getStatusLabel = () => {
    return isError
      ? `${classes.heading} ${classes.error}`
      : `${classes.heading} ${classes.noError}`;
  };

  return (
    <Card>
      <Typography className={getStatusLabel()} align="center" variant="h6">
        Rmf Systems Panel
      </Typography>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Avatar alt="Romi-H logo" src={bannerUrl} />}
        title={<Typography variant="body1">Rmf Systems</Typography>}
        subheader={<Typography variant="body2">Summary of equipment states</Typography>}
      />
    </Card>
  );
};
