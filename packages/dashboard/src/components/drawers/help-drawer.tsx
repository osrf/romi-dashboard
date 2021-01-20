import {
  Checkbox,
  Divider,
  Drawer,
  DrawerProps,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import BugReportIcon from '@material-ui/icons/BugReport';
import DirectionsIcon from '@material-ui/icons/Directions';
import React from 'react';
import { AppControllerContext, TooltipsContext } from '../app-contexts';
import DrawerHeader from './drawer-header';

export interface HotKeysDrawerProps extends DrawerProps {
  handleCloseButton(): void;
  setShowHotkeyDialog(): void;
  showTour(): void;
}

export default function HelpDrawer(props: HotKeysDrawerProps): React.ReactElement {
  const { handleCloseButton, setShowHotkeyDialog, showTour, ...otherProps } = props;
  const classes = useStyles();
  const drawerAnchor = useMediaQuery('(max-aspect-ratio: 8/10)') ? 'bottom' : 'right';
  const modalProp = {
    disableEnforceFocus: true,
  };
  const { showTooltips } = React.useContext(TooltipsContext);
  const { toggleTooltips } = React.useContext(AppControllerContext);

  return (
    <Drawer
      PaperProps={{ className: classes.drawer }}
      anchor={drawerAnchor}
      ModalProps={modalProp}
      {...otherProps}
    >
      <DrawerHeader handleCloseButton={handleCloseButton} title={'Help'} />
      <div className={classes.detail} id="help-drawer-options">
        <div
          className={classes.detailLine}
          onClick={() => {
            setShowHotkeyDialog();
            handleCloseButton();
          }}
        >
          <IconButton id="show-hotkeys-btn" aria-label="close-help" color="inherit">
            <DirectionsIcon />
          </IconButton>
          <Typography variant="h5"> Hotkeys </Typography>
        </div>
        <Divider />

        <div className={classes.detailLine}>
          <IconButton id="show-hotkeys-btn" color="inherit">
            <BugReportIcon />
          </IconButton>
          <Typography variant="h5"> Report an error </Typography>
        </div>
        <Divider />

        <div className={classes.detailLine}>
          <Checkbox
            style={{ padding: '0 5px 0 2px' }}
            checked={showTooltips}
            size="small"
            color="primary"
            inputProps={{ 'aria-label': 'tooltip checkbox' }}
            onChange={(event) => {
              toggleTooltips();
              localStorage.setItem('dashboardTooltips', event.target.checked.toString());
            }}
          />
          <Typography variant="h5"> Toggle tooltips </Typography>
        </div>
        <Divider />
      </div>
    </Drawer>
  );
}

const useStyles = makeStyles((theme) => ({
  detailLine: {
    display: 'inline-flex',
    padding: theme.spacing(0.5),
    width: '100%',
    '& button': {
      padding: '0 5px 0 0',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    cursor: 'pointer',
  },
  detail: {
    display: 'flex',
    flexFlow: 'column',
    padding: '1rem',
  },
  drawer: {
    '@media (min-aspect-ratio: 8/10)': {
      width: 300,
    },
    '@media (max-aspect-ratio: 8/10)': {
      width: '100%',
    },
  },
}));
