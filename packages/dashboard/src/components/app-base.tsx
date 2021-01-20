import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import appConfig from '../app-config';
import ResourceManager from '../managers/resource-manager';
import { loadSettings, saveSettings } from '../settings';
import {
  AppController,
  AppControllerContext,
  ResourcesContext,
  SettingsContext,
  Tooltips,
  TooltipsContext,
} from './app-contexts';
import { AppDrawers } from './app-drawers';
import AppBar from './appbar';
import LoadingScreen, { LoadingScreenProps } from './loading-screen';
import NotificationBar, { NotificationBarProps } from './notification-bar';

const useStyles = makeStyles({
  appBase: {
    width: '100%',
    height: '100%',
  },
});

/**
 * Contains various components that are essential to the app and provides contexts to control them.
 * Components include:
 *
 * - Settings
 * - Help
 * - Tooltip
 * - Hotkeys reference
 * - Notifications
 * - Snackbars
 *
 * Also provides `AppControllerContext` to allow children components to control them.
 */
export function AppBase(props: React.PropsWithChildren<{}>): JSX.Element | null {
  const classes = useStyles();

  const resourceManager = React.useRef<ResourceManager | undefined>(undefined);

  const [settings, setSettings] = React.useState(() => loadSettings());
  const [showSettings, setShowSettings] = React.useState(false);

  const [showHelp, setShowHelp] = React.useState(false);

  const [showHotkeysDialog, setShowHotkeysDialog] = React.useState(false);

  const [loadingScreenProps, setLoadingScreenProps] = React.useState<LoadingScreenProps>({});

  const [notificationProps, setNotificationProps] = React.useState<NotificationBarProps>({
    message: null,
    type: 'info',
  });

  const [showTooltips, setShowTooltips] = React.useState(false);
  const tooltips = React.useMemo<Tooltips>(
    () => ({
      showTooltips,
    }),
    [showTooltips],
  );

  const appController = React.useMemo<AppController>(
    () => ({
      showSettings: setShowSettings,
      setSettings,
      saveSettings,
      toggleSettings: () => setShowSettings((prev) => !prev),
      showHelp: setShowHelp,
      toggleHelp: () => setShowHelp((prev) => !prev),
      showHotkeysDialog: setShowHotkeysDialog,
      toggleHotkeysDialog: () => setShowHotkeysDialog((prev) => !prev),
      showNotification: setNotificationProps,
      showTooltips: setShowTooltips,
      toggleTooltips: () => setShowTooltips((prev) => !prev),
      showLoadingScreen: setLoadingScreenProps,
    }),
    [],
  );

  const [appReady, setAppReady] = React.useState(false);

  /**
   * If resource loading gets too long we should add a loading screen.
   */
  React.useEffect(() => {
    if (!appConfig.appResources) {
      setAppReady(true);
      return;
    }
    (async () => {
      resourceManager.current = await appConfig.appResources;
      setAppReady(true);
    })();
  }, []);

  return appReady ? (
    <SettingsContext.Provider value={settings}>
      <ResourcesContext.Provider value={resourceManager.current}>
        <TooltipsContext.Provider value={tooltips}>
          <AppControllerContext.Provider value={appController}>
            <Grid container direction="column" className={classes.appBase}>
              <AppBar />
              <Grid style={{ flexGrow: 1 }}>
                <LoadingScreen {...loadingScreenProps}>{props.children}</LoadingScreen>
              </Grid>
              <NotificationBar {...notificationProps} />
              <AppDrawers
                settings={settings}
                showHelp={showHelp}
                showHotkeysDialog={showHotkeysDialog}
                showSettings={showSettings}
              />
            </Grid>
          </AppControllerContext.Provider>
        </TooltipsContext.Provider>
      </ResourcesContext.Provider>
    </SettingsContext.Provider>
  ) : null;
}
