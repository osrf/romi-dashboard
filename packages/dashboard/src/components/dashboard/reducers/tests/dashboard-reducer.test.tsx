import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { dashboardInitialValues } from '../../dashboard';
import { ReducerDashboardProps, useDashboardReducer } from '../dashboard-reducer';

describe('main menu reducer update states correctly', () => {
  let result: HookResult<ReducerDashboardProps>;
  beforeEach(() => {
    const hookResult = renderHook(() => useDashboardReducer(dashboardInitialValues));
    result = hookResult.result;
  });

  test('updates current view correctly', () => {
    act(() => {
      result.current.dispatch.setCurrentView(2);
    });
    expect(result.current.state.currentView).toBe(2);
  });

  test('`pushView` updates stackNavigator and currentView correctly', () => {
    act(() => {
      result.current.dispatch.pushView(3);
    });
    expect(result.current.state.currentView).toBe(3);
    expect(result.current.state.stackNavigator.top()).toBe(3);
  });

  test('`popView` pops elements from stackNavigator', () => {
    act(() => {
      result.current.dispatch.pushView(3);
      result.current.dispatch.pushView(4);
      result.current.dispatch.popView();
    });
    expect(result.current.state.stackNavigator.top()).toBe(3);
  });

  test('`resetView` resets elements from stackNavigator', () => {
    act(() => {
      result.current.dispatch.pushView(3);
      result.current.dispatch.pushView(4);
      result.current.dispatch.pushView(5);
      result.current.dispatch.resetView();
    });
    expect(result.current.state.stackNavigator.top()).toBe(0);
  });
});
