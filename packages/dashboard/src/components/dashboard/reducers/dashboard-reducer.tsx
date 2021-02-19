import React from 'react';
import { StackNavigator } from 'react-components';
import { OmniPanelViewIndex } from '../dashboard';

type DashboardActionFormat<T, K = void> = K extends void
  ? {
      type: T;
    }
  : {
      type: T;
      payload: K;
    };

export enum DashboardActionType {
  ShowOmniPanel = 'showOmniPanel',
  ToggleOmnipanel = 'toggleOmnipanel',
  CurrentView = 'currentView',
  PopView = 'popView',
  PushView = 'pushView',
  ResetView = 'resetView',
  TourState = 'tourState',
}

export type DashboardState = {
  [DashboardActionType.ShowOmniPanel]: boolean;
  [DashboardActionType.CurrentView]: number;
  stackNavigator: StackNavigator<OmniPanelViewIndex>;
};

export type DashboardAction =
  | DashboardActionFormat<'showOmniPanel', DashboardState['showOmniPanel']>
  | DashboardActionFormat<'toggleOmnipanel'>
  | DashboardActionFormat<'currentView', DashboardState['currentView']>
  | DashboardActionFormat<'popView'>
  | DashboardActionFormat<'pushView', DashboardState['currentView']>
  | DashboardActionFormat<'resetView'>;

export const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction,
): DashboardState => {
  switch (action.type) {
    case DashboardActionType.ShowOmniPanel:
      return { ...state, [DashboardActionType.ShowOmniPanel]: action.payload };
    case DashboardActionType.ToggleOmnipanel:
      return { ...state, showOmniPanel: !state.showOmniPanel };
    case DashboardActionType.CurrentView:
      return { ...state, [DashboardActionType.CurrentView]: action.payload };
    case DashboardActionType.PopView:
      return { ...state, [DashboardActionType.CurrentView]: state.stackNavigator.pop() };
    case DashboardActionType.PushView:
      state.stackNavigator.push(action.payload);
      return { ...state, [DashboardActionType.CurrentView]: action.payload };
    case DashboardActionType.ResetView:
      state.stackNavigator.reset();
      return { ...state, [DashboardActionType.CurrentView]: state.stackNavigator.reset() };
    default:
      console.error('Unexpected action');
      return state;
  }
};

export interface ReducerDashboardDispatch {
  setShowOmniPanel: (payload: DashboardState['showOmniPanel']) => void;
  toggleOmnipanel: () => void;
  popView: () => void;
  pushView: (payload: DashboardState['currentView']) => void;
  resetView: () => void;
  setCurrentView: (payload: DashboardState['currentView']) => void;
}
export interface ReducerDashboardProps {
  state: DashboardState;
  dispatch: ReducerDashboardDispatch;
}

export const useDashboardReducer = (initialValue: DashboardState): ReducerDashboardProps => {
  const [_state, _dispatch] = React.useReducer(dashboardReducer, initialValue);
  // We add a useMemo here because React identifies that the state and dispatch props are always
  // changing, which causes a huge performance issue.
  const state = React.useMemo(() => _state, [_state]);
  const dispatch: ReducerDashboardDispatch = React.useMemo(() => {
    return {
      setShowOmniPanel: (payload) =>
        _dispatch({ type: DashboardActionType.ShowOmniPanel, payload: payload }),
      toggleOmnipanel: () => _dispatch({ type: DashboardActionType.ToggleOmnipanel }),
      popView: () => _dispatch({ type: DashboardActionType.PopView }),
      pushView: (payload) => _dispatch({ type: DashboardActionType.PushView, payload: payload }),
      resetView: () => _dispatch({ type: DashboardActionType.ResetView }),
      setCurrentView: (payload) =>
        _dispatch({ type: DashboardActionType.CurrentView, payload: payload }),
    } as ReducerDashboardDispatch;
  }, []);
  return {
    state,
    dispatch,
  };
};
