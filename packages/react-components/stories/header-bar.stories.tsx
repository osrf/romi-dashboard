import React from 'react';
import { Story, Meta } from '@storybook/react';
import { HeaderBar } from '../lib/header-bar';
import { createStyles, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { NavigationBar } from '../lib/navigation-bar';
import { BannerTab } from '../lib/banner-tab';

export default {
  title: 'Header Bar',
  component: HeaderBar,
} as Meta;

export const NavBar: Story = () => {
  const [value, setValue] = React.useState('building');

  const onTabChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <TabContext value={value}>
        <HeaderBar>
          <NavigationBar onTabChange={onTabChange} value={value}>
            <Tab
              key={'building-tab'}
              label={'Building'}
              value={'building'}
              aria-label={`building-tab`}
            />
            <Tab key={'robots'} label={'Robots'} value={'robots'} aria-label={`building-tab`} />
          </NavigationBar>
        </HeaderBar>
        <TabPanel key={'building-panel'} value={'building'}>
          <Typography variant="caption">tab panel data</Typography>
        </TabPanel>
        <TabPanel key={'robots-panel'} value={'robots'}>
          <Typography variant="caption">other tab panel data</Typography>
        </TabPanel>
      </TabContext>
    </>
  );
};

export const FullHeaderBar: Story = () => {
  const useStyles = makeStyles(() =>
    createStyles({
      toolbar: {
        textAlign: 'right',
        flexGrow: -1,
      },
    }),
  );
  const [value, setValue] = React.useState('building');
  const classes = useStyles();

  const onTabChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <TabContext value={value}>
        <HeaderBar>
          <BannerTab logoPath={'/resources/roshealth-logo-white.png'} />
          <NavigationBar onTabChange={onTabChange} value={value}>
            <Tab
              key={'building-tab'}
              label={'Building'}
              value={'building'}
              aria-label={`building-tab`}
            />
            <Tab key={'robots'} label={'Robots'} value={'robots'} aria-label={`building-tab`} />
          </NavigationBar>
          <Toolbar variant="dense" className={classes.toolbar}>
            <Typography variant="caption">Powered by OpenRMF</Typography>
            <IconButton id="user-btn" aria-label={'user-btn'} color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </HeaderBar>
        <TabPanel key={'building-panel'} value={'building'}>
          <Typography variant="caption">tab panel data</Typography>
        </TabPanel>
        <TabPanel key={'robots-panel'} value={'robots'}>
          <Typography variant="caption">other tab panel data</Typography>
        </TabPanel>
      </TabContext>
    </>
  );
};