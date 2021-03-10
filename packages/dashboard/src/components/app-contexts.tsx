import React from 'react';
import appConfig, { AppConfig } from '../app-config';
import ResourceManager from '../managers/resource-manager';
import { defaultSettings, Settings } from '../settings';
import { LoadingScreenProps } from './loading-screen';
import { NotificationBarProps } from './notification-bar';
import { Emergency } from './emergency-alarm';

/* Declares the ResourcesContext which contains the resources used on the app*/
export const ResourcesContext = React.createContext<ResourceManager | undefined>(undefined);

export const SettingsContext = React.createContext(defaultSettings());

export interface AppController {
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveSettings(settings: Settings): void;
  showSettings(show: boolean): void;
  toggleSettings(): void;
  showHelp(show: boolean): void;
  toggleHelp(): void;
  showHotkeysDialog(show: boolean): void;
  toggleHotkeysDialog(): void;
  showNotification: React.Dispatch<React.SetStateAction<NotificationBarProps>>;
  /**
   * FIXME: Move this to settings, this sets if we should show the tooltip icon, and not trigger
   * a tooltip to show.
   */
  showTooltips(show: boolean): void;
  /**
   * FIXME: Move this to settings, this sets if we should show the tooltip icon, and not trigger
   * a tooltip to show.
   */
  toggleTooltips(): void;
  showLoadingScreen: React.Dispatch<React.SetStateAction<LoadingScreenProps>>;
  showAlarms(show: boolean): void;
  toggleAlarms(): void;
  showEmergencyDialog(show: boolean): void;
  setEmergencyState: React.Dispatch<React.SetStateAction<Emergency>>;
}

export interface Tooltips {
  showTooltips: boolean;
}

export const TooltipsContext = React.createContext<Tooltips>({
  showTooltips: true,
});

export const AppControllerContext = React.createContext<AppController>({
  setSettings: () => {},
  saveSettings: () => {},
  showSettings: () => {},
  toggleSettings: () => {},
  showHelp: () => {},
  toggleHelp: () => {},
  showHotkeysDialog: () => {},
  toggleHotkeysDialog: () => {},
  showNotification: () => {},
  showTooltips: () => {},
  toggleTooltips: () => {},
  showLoadingScreen: () => {},
  showAlarms: () => {},
  toggleAlarms: () => {},
  showEmergencyDialog: () => {},
  setEmergencyState: () => {},
});

export const AppConfigContext = React.createContext<AppConfig>(appConfig);
