import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { loadSettings, saveSettings } from '../settings';
import {
  AppController,
  AppControllerContext,
  SettingsContext,
  Tooltips,
  TooltipsContext,
} from './app-contexts';
import { AppDrawers } from './app-drawers';
import AppBar from './appbar';
import LoadingScreen, { LoadingScreenProps } from './loading-screen';
import NotificationBar, { NotificationBarProps } from './notification-bar';
import { Emergency } from './emergency-alarm';

const useStyles = makeStyles({
  appBase: {
    width: '100%',
    height: '100%',
  },
  appContent: {
    position: 'relative',
    flexGrow: 1,
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
 * - Emergency Alarms
 *
 * Also provides `AppControllerContext` to allow children components to control them.
 */
export function AppBase(props: React.PropsWithChildren<{}>): JSX.Element | null {
  const classes = useStyles();

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

  const [showAlarms, setShowAlarms] = React.useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = React.useState(false);
  const [emergencyState, setEmergencyState] = React.useState<Emergency>({ type: '' });

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
      showAlarms: setShowAlarms,
      toggleAlarms: () => setShowAlarms((prev) => !prev),
      showEmergencyDialog: () => setShowEmergencyDialog((prev) => !prev),
      setEmergencyState,
    }),
    [],
  );

  return (
    <SettingsContext.Provider value={settings}>
      <TooltipsContext.Provider value={tooltips}>
        <AppControllerContext.Provider value={appController}>
          <Grid container direction="column" className={classes.appBase}>
            <AppBar />
            <Grid className={classes.appContent}>
              <LoadingScreen {...loadingScreenProps}>{props.children}</LoadingScreen>
            </Grid>
            <NotificationBar {...notificationProps} />
            <AppDrawers
              settings={settings}
              showHelp={showHelp}
              showHotkeysDialog={showHotkeysDialog}
              showSettings={showSettings}
              showAlarms={showAlarms}
              showEmergencyDialog={showEmergencyDialog}
              setEmergencyState={setEmergencyState}
              emergencyState={emergencyState}
            />
          </Grid>
        </AppControllerContext.Provider>
      </TooltipsContext.Provider>
    </SettingsContext.Provider>
  );
}
