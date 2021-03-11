import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { useStackNavigator, StackNavigatorDispatch } from 'react-components';
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
  const { result: viewResult } = renderHook(() =>
    useStackNavigator([OmniPanelViewIndex.MainMenu], OmniPanelViewIndex.MainMenu),
  );
  const viewStackDispatch = viewResult.current[1];
  const hotkeys = buildHotKeys({
    viewStackDispatch,
    reducerDashboardDispatch: result.current.dispatch,
    appController: makeMockAppController(),
  });
  if (!hotkeys.keyMap) throw new Error('An error has occurred building the hotkeys formats');
  expect(Object.keys(hotkeys.keyMap)).toEqual(Object.keys(keyMap));
});

describe('update states correctly', () => {
  let hotkeys: HotKeysEnabledProps;
  let result: HookResult<ReducerDashboardProps>;
  let viewResult: HookResult<[OmniPanelViewIndex[], StackNavigatorDispatch<OmniPanelViewIndex>]>;
  let appController: AppController;

  beforeEach(() => {
    const hookResult = renderHook(() => useDashboardReducer(dashboardInitialValues));
    viewResult = renderHook(() =>
      useStackNavigator([OmniPanelViewIndex.MainMenu], OmniPanelViewIndex.MainMenu),
    ).result;
    result = hookResult.result;
    appController = makeMockAppController();
    hotkeys = buildHotKeys({
      viewStackDispatch: viewResult.current[1],
      reducerDashboardDispatch: result.current.dispatch,
      appController,
    });
  });

  test('set commands as current view', () => {
    act(() => {
      hotkeys.handlers?.OPEN_COMMANDS();
    });
    const viewStack = viewResult.current[0];
    expect(viewStack[viewStack.length - 1]).toBe(OmniPanelViewIndex.Commands);
  });

  test('set dispensers as current view', () => {
    act(() => {
      hotkeys.handlers?.OPEN_DISPENSERS();
    });
    const viewStack = viewResult.current[0];
    expect(viewStack[viewStack.length - 1]).toBe(OmniPanelViewIndex.Dispensers);
  });

  test('set doors as current view', () => {
    act(() => {
      hotkeys.handlers?.OPEN_DOORS();
    });
    const viewStack = viewResult.current[0];
    expect(viewStack[viewStack.length - 1]).toBe(OmniPanelViewIndex.Doors);
  });

  test('set lifts current view correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_LIFTS();
    });
    const viewStack = viewResult.current[0];
    expect(viewStack[viewStack.length - 1]).toBe(OmniPanelViewIndex.Lifts);
  });

  test('set robots current view correctly', () => {
    act(() => {
      hotkeys.handlers?.OPEN_ROBOTS();
    });
    const viewStack = viewResult.current[0];
    expect(viewStack[viewStack.length - 1]).toBe(OmniPanelViewIndex.Robots);
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
