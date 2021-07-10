import { makeStyles, Paper, Typography } from '@material-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Theme',
} as Meta;

interface ColorCardProps {
  color: string | undefined;
  colorName: string;
}

const ColorCard = (props: ColorCardProps): JSX.Element => {
  const { color, colorName } = props;
  const useStyles = makeStyles(() => ({
    paperSize: {
      width: '100px',
      height: '100px',
    },
    colorDescription: {
      width: '100px',
    },
  }));
  const classes = useStyles();

  return (
    <div style={{ margin: '0 1rem' }}>
      <Paper className={`${color} ${classes.paperSize}`} />
      <Typography variant="body1" align="center" className={classes.colorDescription}>
        {colorName}
      </Typography>
    </div>
  );
};

const ThemeDisplay = (): JSX.Element => {
  const useStyles = makeStyles((theme) => ({
    main: {
      backgroundColor: theme.palette.primary.main,
    },
    themedefault: {
      backgroundColor: theme.palette.background.default,
    },
    themePaper: {
      backgroundColor: theme.palette.background.paper,
    },
    themeFont: {
      backgroundColor: theme.palette.text.primary,
    },
    success: {
      backgroundColor: theme.palette.success.main,
    },
    error: {
      backgroundColor: theme.palette.error.main,
    },
    warning: {
      backgroundColor: theme.palette.warning.main,
    },
    info: {
      backgroundColor: theme.palette.info.main,
    },
    divider: {
      backgroundColor: theme.palette.divider,
    },
    // non theme related styles
    header: {
      marginLeft: '1rem',
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h5" className={classes.header}>
        Theme Colors
      </Typography>
      <div style={{ display: 'flex' }}>
        <ColorCard color={classes.main} colorName={'Main'} />
        <ColorCard color={classes.themedefault} colorName={'Default'} />
        <ColorCard color={classes.themePaper} colorName={'Paper'} />
        <ColorCard color={classes.themeFont} colorName={'Font'} />
        <ColorCard color={classes.success} colorName={'Success'} />
        <ColorCard color={classes.error} colorName={'Error'} />
        <ColorCard color={classes.warning} colorName={'Warning'} />
        <ColorCard color={classes.info} colorName={'Info'} />
        <ColorCard color={classes.divider} colorName={'Divider'} />
      </div>
    </div>
  );
};

export const ThemeStory: Story = (args) => {
  return <ThemeDisplay {...args} />;
};
