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
import { HeaderBar } from 'react-components/lib/header-bar';
import { LogoButton } from 'react-components/lib/logo-button';
import { NavigationBar } from 'react-components/lib/navigation-bar';
import DashboardTooltip from 'react-components/lib/tooltip';
import {
  AppControllerContext,
  ResourcesContext,
  TooltipsContext,
  SettingsContext,
} from './app-contexts';
import { AuthenticatorContext, UserContext } from './auth/contexts';
import { ThemeMode, UseTheme } from '../settings';

const useStyles = makeStyles(() =>
  createStyles({
    toolbar: {
      textAlign: 'right',
      flexGrow: -1,
    },
  }),
);

export type TabValue = 'building' | 'robots' | 'tasks';

export interface AppBarProps {
  tabValue: TabValue;
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
    const authenticator = React.useContext(AuthenticatorContext);
    const user = React.useContext(UserContext);
    const { showTooltips } = React.useContext(TooltipsContext);

    const curTheme = React.useContext(SettingsContext).themeMode;
    const isUseTheme = React.useContext(SettingsContext).useTheme;

    async function handleLogout(): Promise<void> {
      try {
        await authenticator.logout();
      } catch (e) {
        console.error(`error logging out: ${e.message}`);
      }
    }

    const brandingIconPath = React.useMemo(() => {
      const defaultIcon = 'defaultLogo.png';
      let logoUrl: string | null;
      if (!logoResourcesContext) {
        return defaultIcon;
      }
      const logoPath = logoResourcesContext.getIconPath('headerLogo');
      const blueLogoPath = logoResourcesContext.getIconPath('darkThemeLogo');

      if (isUseTheme === UseTheme.False) return logoPath;
      logoUrl = curTheme === ThemeMode.Dark ? logoPath : blueLogoPath;
      return logoUrl;
    }, [logoResourcesContext, curTheme, isUseTheme]);

    return (
      <div>
        <HeaderBar>
          <LogoButton logoPath={brandingIconPath ? brandingIconPath : undefined} />
          <NavigationBar onTabChange={onTabChange} value={tabValue}>
            <Tab label="Building" value="building" aria-label="Building" />
            <Tab label="Robots" value="robots" aria-label="Robots" />
            <Tab label="Tasks" value="tasks" aria-label="Tasks" />
          </NavigationBar>
          <Toolbar variant="dense" className={classes.toolbar}>
            <Typography variant="caption">Powered by OpenRMF</Typography>
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
        </HeaderBar>
      </div>
    );
  },
);

export default AppBar;
