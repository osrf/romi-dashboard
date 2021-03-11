import React from 'react';

export interface StackNavigatorDispatch<KeyType> {
  /**
   * Push a new view into the stack, this triggers a re-render.
   */
  push(view: KeyType): void;
  /**
   * Remove the top element of the stack, this triggers a re-render.
   * If the stack only has one item remaining, this is a no-op.
   */
  pop(): void;
  /**
   * Sets the top of the stack to the home view, this triggers a re-render.
   */
  home(): void;
  /**
   * Resets the state to the initial state, this triggers a re-render.
   */
  reset(): void;
}

/**
 * A reducer hook that helps manage a stack of views.
 * @param initialState
 * @param homeView
 */
export function useStackNavigator<KeyType>(
  initialState: KeyType[],
  homeView: KeyType,
): [KeyType[], StackNavigatorDispatch<KeyType>] {
  const [stack, setStack] = React.useState<KeyType[]>(initialState);
  return [
    stack,
    {
      push: (viewId: KeyType) => setStack((prev) => [...prev, viewId]),
      pop: () => setStack((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : prev)),
      home: () => setStack((prev) => [...prev, homeView]),
      reset: () => setStack(initialState),
    },
  ];
}

export default useStackNavigator;
