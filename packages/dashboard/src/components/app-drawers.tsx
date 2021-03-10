import React from 'react';
import { saveSettings, Settings } from '../settings';
import { AppControllerContext } from './app-contexts';
import AlarmDrawer from './drawers/alarm-drawer';
import EmergencyDialog from './drawers/emergency-dialog';
import HelpDrawer from './drawers/help-drawer';
import HotKeysDialog from './drawers/hotkeys-dialog';
import SettingsDrawer from './drawers/settings-drawer';
import { Emergency } from './emergency-alarm';

interface AppDrawersProps {
  settings: Settings;
  showSettings: boolean;
  showHelp: boolean;
  showHotkeysDialog: boolean;
  showAlarms: boolean;
  showEmergencyDialog: boolean;
  setEmergencyState: React.Dispatch<React.SetStateAction<Emergency>>;
  emergencyState: Emergency;
}

export const AppDrawers = React.memo(
  (props: AppDrawersProps): JSX.Element => {
    const {
      settings,
      showSettings,
      showHelp,
      showHotkeysDialog,
      showAlarms,
      showEmergencyDialog,
      emergencyState,
    } = props;
    const {
      showSettings: setShowSettings,
      setSettings,
      showHelp: setShowHelp,
      showHotkeysDialog: setShowHotkeysDialog,
      showAlarms: setShowAlarms,
      showEmergencyDialog: setShowEmergencyDialog,
      setEmergencyState,
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

        <AlarmDrawer
          open={showAlarms}
          handleCloseButton={() => setShowAlarms(false)}
          onClose={() => setShowAlarms(false)}
          triggerCodeBlue={() => {
            setShowEmergencyDialog(true);
            setEmergencyState({ type: 'Code Blue' });
          }}
          triggerCodeRed={() => {
            setShowEmergencyDialog(true);
            setEmergencyState({ type: 'Code Red' });
          }}
        />

        {showEmergencyDialog && (
          <EmergencyDialog
            open={showEmergencyDialog}
            handleClose={() => setShowEmergencyDialog(false)}
            type={emergencyState}
          />
        )}
      </>
    );
  },
);
