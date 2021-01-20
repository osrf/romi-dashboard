import { AppController } from '../app-contexts';

export function makeMockAppController(): AppController {
  return {
    saveSettings: jest.fn(),
    setSettings: jest.fn(),
    showHelp: jest.fn(),
    showHotkeysDialog: jest.fn(),
    showLoadingScreen: jest.fn(),
    showNotification: jest.fn(),
    showSettings: jest.fn(),
    showTooltips: jest.fn(),
    toggleHelp: jest.fn(),
    toggleHotkeysDialog: jest.fn(),
    toggleSettings: jest.fn(),
    toggleTooltips: jest.fn(),
  };
}
