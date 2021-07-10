import { Grid, makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core';
import React from 'react';
import { rmfDark, rmfLight, GlobalCss } from 'react-components';
import { loadSettings, saveSettings, ThemeMode, UseTheme } from '../settings';
import {
  AppController,
  AppControllerContext,
  SettingsContext,
  Tooltips,
  TooltipsContext,
} from './app-contexts';
import { AppDrawers } from './app-drawers';
import AppBar, { AppBarProps } from './appbar';

const useStyles = makeStyles((theme) => ({
  appBase: {
    width: '100%',
    height: '100%',
  },
}));

export const defaultTheme = createMuiTheme();

export interface AppBaseProps {
  appbarProps: AppBarProps;
}

/**
 * Contains various components that are essential to the app and provides contexts to control them.
 * Components include:
 *
 * - Settings
 * - Help
 * - Tooltip
 * - Hotkeys reference
 * - Notifications
 *
 * Also provides `AppControllerContext` to allow children components to control them.
 */
export function AppBase({
  appbarProps,
  children,
}: React.PropsWithChildren<AppBaseProps>): JSX.Element | null {
  const classes = useStyles();

  const [settings, setSettings] = React.useState(() => loadSettings());
  const [showSettings, setShowSettings] = React.useState(false);

  const [showHelp, setShowHelp] = React.useState(false);

  const [showHotkeysDialog, setShowHotkeysDialog] = React.useState(false);

  const [showTooltips, setShowTooltips] = React.useState(false);

  const theme = React.useMemo(() => {
    if (settings.useTheme === UseTheme.False) return defaultTheme;
    const preferDarkMode = settings.themeMode === ThemeMode.Dark;
    return preferDarkMode ? rmfDark : rmfLight;
  }, [settings.useTheme, settings.themeMode]);

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
      showTooltips: setShowTooltips,
      toggleTooltips: () => setShowTooltips((prev) => !prev),
    }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalCss />
      <SettingsContext.Provider value={settings}>
        <TooltipsContext.Provider value={tooltips}>
          <AppControllerContext.Provider value={appController}>
            <Grid container direction="column" className={classes.appBase} wrap="nowrap">
              <AppBar {...appbarProps} />
              {children}
              <AppDrawers
                settings={settings}
                showHelp={showHelp}
                showHotkeysDialog={showHotkeysDialog}
                showSettings={showSettings}
              />
            </Grid>
          </AppControllerContext.Provider>
        </TooltipsContext.Provider>
      </SettingsContext.Provider>
    </ThemeProvider>
  );
}
