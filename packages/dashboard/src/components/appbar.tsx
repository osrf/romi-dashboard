import {
  AppBar as MuiAppBar,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import DashboardTooltip from 'react-components/lib/tooltip';
import { AppControllerContext, TooltipsContext } from './app-contexts';
import { AuthenticatorContext, UserContext } from './auth/contexts';

export interface AppBarProps {
  // TODO: change the alarm status to required when we have an alarm
  // service working properly in the backend
  alarmState?: boolean | null;
}

export const AppBar = React.memo(
  (_props: AppBarProps): React.ReactElement => {
    const { showHelp: setShowHelp, showSettings: setShowSettings } = React.useContext(
      AppControllerContext,
    );

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const classes = useStyles();
    const authenticator = React.useContext(AuthenticatorContext);
    const user = React.useContext(UserContext);
    const { showTooltips } = React.useContext(TooltipsContext);

    async function handleLogout(): Promise<void> {
      try {
        await authenticator.logout();
      } catch (e) {
        console.error(`error logging out: ${e.message}`);
      }
    }

    return (
      <MuiAppBar id="appbar" position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.toolbarTitle}>
            Dashboard
          </Typography>

          <DashboardTooltip
            title="Define dashboard trajectory settings"
            id="setting-tooltip"
            enabled={showTooltips}
          >
            <IconButton
              id="show-settings-btn"
              aria-label="settings"
              color="inherit"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon />
            </IconButton>
          </DashboardTooltip>
          {user && (
            <>
              <IconButton
                id="user-btn"
                aria-label={'user-btn'}
                color="inherit"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem id="logout-btn" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
          <DashboardTooltip
            title="Help tools and resources"
            id="help-tooltip"
            enabled={showTooltips}
          >
            <IconButton
              id="show-help-btn"
              aria-label="help"
              color="inherit"
              onClick={() => setShowHelp(true)}
            >
              <HelpIcon />
            </IconButton>
          </DashboardTooltip>
        </Toolbar>
      </MuiAppBar>
    );
  },
);

const useStyles = makeStyles((_theme) => ({
  toolbarTitle: {
    flexGrow: 1,
  },
  avatar: {
    cursor: 'pointer',
  },
}));

export default AppBar;
