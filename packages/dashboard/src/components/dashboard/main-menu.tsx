import { Divider, List, ListItem, makeStyles, Typography } from '@material-ui/core';
import Debug from 'debug';
import React from 'react';
import DashboardTooltip from 'react-components/lib/tooltip';
import { TooltipsContext } from '../app-contexts';
import { OmniPanelViewIndex } from './dashboard';

const debug = Debug('MainMenu');

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

export interface MainMenuProps {
  pushView(view: OmniPanelViewIndex): void;
  /**
   * resets the filter term once called
   */
  setFilter?: () => void;
}

export const MainMenu = React.memo((props: MainMenuProps) => {
  const { showTooltips } = React.useContext(TooltipsContext);
  const { pushView, setFilter } = props;
  debug('render');
  const classes = useStyles();

  const handleMainMenuDoorsClick = React.useCallback(() => {
    pushView(OmniPanelViewIndex.Doors);
    setFilter && setFilter();
  }, [pushView, setFilter]);

  const handleMainMenuLiftsClick = React.useCallback(() => {
    pushView(OmniPanelViewIndex.Lifts);
    setFilter && setFilter();
  }, [pushView, setFilter]);

  const handleMainMenuRobotsClick = React.useCallback(() => {
    pushView(OmniPanelViewIndex.Robots);
    setFilter && setFilter();
  }, [pushView, setFilter]);

  const handleMainMenuDispensersClick = React.useCallback(() => {
    pushView(OmniPanelViewIndex.Dispensers);
    setFilter && setFilter();
  }, [pushView, setFilter]);

  const handleMainMenuNegotiationsClick = React.useCallback(() => {
    pushView(OmniPanelViewIndex.Negotiations);
    setFilter && setFilter();
  }, [pushView, setFilter]);

  return (
    <List className={classes.root} data-component="MainMenu">
      <ListItem data-item="Doors" button={true} onClick={handleMainMenuDoorsClick}>
        <Typography variant="h5">Doors</Typography>
      </ListItem>
      <Divider />

      <ListItem data-item="Lifts" button={true} onClick={handleMainMenuLiftsClick}>
        <Typography variant="h5">Lifts</Typography>
      </ListItem>
      <Divider />

      <ListItem data-item="Robots" button={true} onClick={handleMainMenuRobotsClick}>
        <Typography variant="h5">Robots</Typography>
      </ListItem>
      <Divider />

      <ListItem data-item="Dispensers" button={true} onClick={handleMainMenuDispensersClick}>
        <Typography variant="h5">Dispensers</Typography>
      </ListItem>
      <Divider />

      <ListItem data-item="Negotiations" button={true} onClick={handleMainMenuNegotiationsClick}>
        <DashboardTooltip
          title="This panel shows the negotiations between robots when there are conflicts in trajectories"
          id="negotiations-tooltip"
          enabled={showTooltips}
        >
          <Typography variant="h5">Negotiations</Typography>
        </DashboardTooltip>
      </ListItem>
      <Divider />
    </List>
  );
});

export default MainMenu;
