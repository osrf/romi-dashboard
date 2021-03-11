import React from 'react';

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
  TourState = 'tourState',
}

export type DashboardState = {
  [DashboardActionType.ShowOmniPanel]: boolean;
};

export type DashboardAction =
  | DashboardActionFormat<'showOmniPanel', DashboardState['showOmniPanel']>
  | DashboardActionFormat<'toggleOmnipanel'>;

export const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction,
): DashboardState => {
  switch (action.type) {
    case DashboardActionType.ShowOmniPanel:
      return { ...state, [DashboardActionType.ShowOmniPanel]: action.payload };
    case DashboardActionType.ToggleOmnipanel:
      return { ...state, showOmniPanel: !state.showOmniPanel };
    default:
      console.error('Unexpected action');
      return state;
  }
};

export interface ReducerDashboardDispatch {
  setShowOmniPanel: (payload: DashboardState['showOmniPanel']) => void;
  toggleOmnipanel: () => void;
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
    } as ReducerDashboardDispatch;
  }, []);
  return {
    state,
    dispatch,
  };
};
