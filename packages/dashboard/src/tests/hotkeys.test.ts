import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { HotKeysEnabledProps } from 'react-hotkeys';
import { AppController } from '../components/app-contexts';
import { dashboardInitialValues, OmniPanelViewIndex } from '../components/dashboard/dashboard';
import {
  ReducerDashboardProps,
  useDashboardReducer,
} from '../components/dashboard/reducers/dashboard-reducer';
import { makeMockAppController } from '../components/tests/mock-app-controller';
import { buildHotKeys, keyMap } from '../hotkeys';

test('build hotkeys on the correct format', () => {
  const { result } = renderHook(() => useDashboardReducer(dashboardInitialValues));
  const hotkeys = buildHotKeys({
    reducerDashboardDispatch: result.current.dispatch,
    appController: makeMockAppController(),
  });
  if (!hotkeys.keyMap) throw new Error('An error has occurred building the hotkeys formats');
  expect(Object.keys(hotkeys.keyMap)).toEqual(Object.keys(keyMap));
});

describe('update states correctly', () => {
  let hotkeys: HotKeysEnabledProps;
  let result: HookResult<ReducerDashboardProps>;
  let appController: AppController;

  beforeEach(() => {
    const hookResult = renderHook(() => useDashboardReducer(dashboardInitialValues));
    result = hookResult.result;
    appController = makeMockAppController();
    hotkeys = buildHotKeys({
      reducerDashboardDispatch: result.current.dispatch,
      appController,
    });
  });

  test('set commands as current view', () => {
    act(() => {
      hotkeys.handlers?.OPEN_COMMANDS();
    });
    expect(result.current.state.currentView).toBe(OmniPanelViewIndex.Commands);
  });

  test('set dispensers as current view', () => {
    act(() => {
      hotkeys.handlers?.OPEN_DISPENSERS();
    });
    expect(result.current.state.currentView).toBe(OmniPanelViewIndex.Dispensers);
  });

  test('set doors as current view', () => {
    act(() => {
      hotkeys.handlers?.OPEN_DOORS();
    });
    expect(result.current.state.currentView).toBe(OmniPanelViewIndex.Doors);
  });

  test('set lifts current view correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_LIFTS();
    });
    expect(result.current.state.currentView).toBe(OmniPanelViewIndex.Lifts);
  });

  test('set robots current view correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_ROBOTS();
    });
    expect(result.current.state.currentView).toBe(OmniPanelViewIndex.Robots);
  });

  test('toggles Help Panel correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_HELP_PANEL();
    });
    expect(appController.toggleHelp).toBeCalledTimes(1);

    act(() => {
      hotkeys.handlers?.OPEN_HELP_PANEL();
    });
    expect(appController.toggleHelp).toBeCalledTimes(2);
  });

  test('toggles Omni Panel correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_OMNIPANEL();
    });
    expect(result.current.state.showOmniPanel).toBe(false);

    act(() => {
      hotkeys.handlers?.OPEN_OMNIPANEL();
    });
    expect(result.current.state.showOmniPanel).toBe(true);
  });

  test('toggles Setting Panel correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_SETTINGS();
    });
    expect(appController.toggleSettings).toBeCalledTimes(1);

    act(() => {
      hotkeys.handlers?.OPEN_SETTINGS();
    });
    expect(appController.toggleSettings).toBeCalledTimes(2);
  });
});
