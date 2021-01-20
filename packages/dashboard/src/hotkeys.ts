import { HotKeysEnabledProps, KeyMap, KeySequence } from 'react-hotkeys';
import { AppController } from './components/app-contexts';
import { OmniPanelViewIndex } from './components/dashboard/dashboard';
import { ReducerDashboardDispatch } from './components/dashboard/reducers/dashboard-reducer';

export interface hotKeysProps {
  reducerDashboardDispatch: ReducerDashboardDispatch;
  appController: AppController;
}

export const keyMap: KeyMap = {
  OPEN_COMMANDS: {
    name: 'Open Commands',
    sequences: [{ sequence: 'shift+c', action: 'keypress' }],
  } as KeySequence,
  OPEN_DISPENSERS: {
    name: 'Open Dispensers',
    sequences: [{ sequence: 'shift+i', action: 'keypress' }],
  } as KeySequence,
  OPEN_DOORS: {
    name: 'Open Doors',
    sequences: [{ sequence: 'shift+d', action: 'keypress' }],
  } as KeySequence,
  OPEN_HELP_PANEL: {
    name: 'Open Help',
    sequences: [{ sequence: 'shift+h', action: 'keypress' }],
  } as KeySequence,
  OPEN_HOTKEYS: {
    name: 'Open Hotkeys',
    sequences: [{ sequence: 'shift+?', action: 'keypress' }],
  } as KeySequence,
  OPEN_LIFTS: {
    name: 'Open Lifts',
    sequences: [{ sequence: 'shift+l', action: 'keypress' }],
  } as KeySequence,
  OPEN_OMNIPANEL: {
    name: 'Open Omnipanel',
    sequences: [{ sequence: 'shift+o', action: 'keypress' }],
  } as KeySequence,
  OPEN_ROBOTS: {
    name: 'Open Robots',
    sequences: [{ sequence: 'shift+r', action: 'keypress' }],
  } as KeySequence,
  OPEN_SETTINGS: {
    name: 'Open Settings',
    sequences: [{ sequence: 'shift+s', action: 'keypress' }],
  } as KeySequence,
};

export const buildHotKeys = (props: hotKeysProps): HotKeysEnabledProps => {
  const { setCurrentView, setShowOmniPanel, toggleOmnipanel } = props.reducerDashboardDispatch;
  const { toggleHotkeysDialog: toggleHotkeys, toggleSettings, toggleHelp } = props.appController;

  const openCommands = () => {
    setShowOmniPanel(true);
    setCurrentView(OmniPanelViewIndex.Commands);
  };

  const openDispensers = () => {
    setShowOmniPanel(true);
    setCurrentView(OmniPanelViewIndex.Dispensers);
  };

  const openDoors = () => {
    setShowOmniPanel(true);
    setCurrentView(OmniPanelViewIndex.Doors);
  };

  const openLifts = () => {
    setShowOmniPanel(true);
    setCurrentView(OmniPanelViewIndex.Lifts);
  };

  const openRobots = () => {
    setShowOmniPanel(true);
    setCurrentView(OmniPanelViewIndex.Robots);
  };

  // Keep the same name as the KeyMap
  const handlers = {
    OPEN_COMMANDS: openCommands,
    OPEN_DISPENSERS: openDispensers,
    OPEN_DOORS: openDoors,
    OPEN_HELP_PANEL: () => toggleHelp(),
    OPEN_HOTKEYS: () => toggleHotkeys(),
    OPEN_LIFTS: openLifts,
    OPEN_OMNIPANEL: () => toggleOmnipanel(),
    OPEN_ROBOTS: openRobots,
    OPEN_SETTINGS: () => toggleSettings(),
  };

  return { keyMap, handlers };
};
