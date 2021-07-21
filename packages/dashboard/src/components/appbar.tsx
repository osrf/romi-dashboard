import {
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Tab,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { HeaderBar, LogoButton, NavigationBar, Tooltip } from 'react-components';
import appConfig from '../app-config';
import { AppControllerContext, ResourcesContext, TooltipsContext } from './app-contexts';
import { UserContext } from './auth/contexts';

const useStyles = makeStyles(() =>
  createStyles({
    toolbar: {
      textAlign: 'right',
      flexGrow: -1,
    },
  }),
);

export type TabValue = 'building' | 'robots' | 'tasks' | 'admin';

export interface AppBarProps {
  tabValue?: TabValue;
  onTabChange?(event: React.ChangeEvent<unknown>, newValue: TabValue): void;
  // TODO: change the alarm status to required when we have an alarm
  // service working properly in the backend
  alarmState?: boolean | null;
}

export const AppBar = React.memo(
  ({ tabValue, onTabChange }: AppBarProps): React.ReactElement => {
    const { showHelp: setShowHelp, showSettings: setShowSettings } = React.useContext(
      AppControllerContext,
    );
    const logoResourcesContext = React.useContext(ResourcesContext)?.logos;
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const classes = useStyles();
    const authenticator = appConfig.authenticator;
    const user = React.useContext(UserContext);
    const { showTooltips } = React.useContext(TooltipsContext);

    async function handleLogout(): Promise<void> {
      try {
        await authenticator.logout();
      } catch (e) {
        console.error(`error logging out: ${e.message}`);
      }
    }

    const brandingIconPath = React.useMemo(() => {
      const defaultIcon = 'defaultLogo.png';
      if (!logoResourcesContext) {
        return defaultIcon;
      }
      const iconPath = logoResourcesContext.getIconPath('headerLogo');
      return iconPath ? iconPath : defaultIcon;
    }, [logoResourcesContext]);

    return (
      <div>
        <HeaderBar>
          <LogoButton logoPath={brandingIconPath} />
          <NavigationBar onTabChange={onTabChange} value={tabValue}>
            <Tab label="Building" value="building" aria-label="Building" />
            <Tab label="Robots" value="robots" aria-label="Robots" />
            <Tab label="Tasks" value="tasks" aria-label="Tasks" />
            {user?.profile.is_admin && <Tab label="Admin" value="admin" aria-label="Admin" />}
          </NavigationBar>
          <Toolbar variant="dense" className={classes.toolbar}>
            <Typography variant="caption">Powered by OpenRMF</Typography>
            <Tooltip
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
            </Tooltip>
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
            <Tooltip title="Help tools and resources" id="help-tooltip" enabled={showTooltips}>
              <IconButton
                id="show-help-btn"
                aria-label="help"
                color="inherit"
                onClick={() => setShowHelp(true)}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </HeaderBar>
      </div>
    );
  },
);

export default AppBar;
