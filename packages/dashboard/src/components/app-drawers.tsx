import React from 'react';
import { saveSettings, Settings } from '../settings';
import { AppControllerContext } from './app-contexts';
import HelpDrawer from './drawers/help-drawer';
import HotKeysDialog from './drawers/hotkeys-dialog';
import SettingsDrawer from './drawers/settings-drawer';

interface AppDrawersProps {
  settings: Settings;
  showSettings: boolean;
  showHelp: boolean;
  showHotkeysDialog: boolean;
}

export const AppDrawers = React.memo(
  (props: AppDrawersProps): JSX.Element => {
    const { settings, showSettings, showHelp, showHotkeysDialog } = props;
    const {
      showSettings: setShowSettings,
      setSettings,
      showHelp: setShowHelp,
      showHotkeysDialog: setShowHotkeysDialog,
    } = React.useContext(AppControllerContext);
    return (
      <>
        <SettingsDrawer
          settings={settings}
          open={showSettings}
          onSettingsChange={(newSettings) => {
            setSettings(newSettings);
            saveSettings(newSettings);
          }}
          onClose={() => setShowSettings(false)}
          handleCloseButton={() => setShowSettings(false)}
        />

        <HelpDrawer
          open={showHelp}
          handleCloseButton={() => setShowHelp(false)}
          onClose={() => setShowHelp(false)}
          setShowHotkeyDialog={() => setShowHotkeysDialog(true)}
          showTour={() => {
            setShowHelp(false);
          }}
        />

        {showHotkeysDialog && (
          <HotKeysDialog open={showHotkeysDialog} handleClose={() => setShowHotkeysDialog(false)} />
        )}
      </>
    );
  },
);
