import { act, renderHook, RenderResult } from '@testing-library/react-hooks/dom';
import { TrashBinAction, TrashBinActionType, TrashBinState, useTrashBinReducer } from '..';

describe('default handler functions', () => {
  let hookResult: RenderResult<[TrashBinState<number>, React.Dispatch<TrashBinAction<number>>]>;

  beforeEach(() => {
    hookResult = renderHook(() => useTrashBinReducer<number>(1, 0)).result;
  });

  it('trash is initialized with empty value', () => {
    expect(hookResult.current[0].trash).toBe(0);
  });

  it('set updates the current state', () => {
    act(() => {
      hookResult.current[1]({ type: TrashBinActionType.Set, payload: 2 });
    });
    expect(hookResult.current[0].current).toBe(2);
  });

  it('set works with callback', () => {
    act(() => {
      hookResult.current[1]({ type: TrashBinActionType.Set, payload: () => 2 });
    });
    expect(hookResult.current[0].current).toBe(2);
  });

  it('clear moves the current state to trash', () => {
    act(() => {
      hookResult.current[1]({ type: TrashBinActionType.Clear });
    });
    expect(hookResult.current[0].trash).toBe(1);
    expect(hookResult.current[0].current).toBe(0);
  });

  it('restore moves the trash to the current state', () => {
    act(() => {
      hookResult.current[1]({ type: TrashBinActionType.Restore });
    });
    expect(hookResult.current[0].current).toBe(0);
    expect(hookResult.current[0].trash).toBe(0);
  });
});

describe('override handler functions', () => {
  it('restore function is called', () => {
    const restoreFunc = jasmine.createSpy();
    const hookResult = renderHook(() => useTrashBinReducer<number>(1, 0, restoreFunc)).result;
    act(() => {
      hookResult.current[1]({ type: TrashBinActionType.Restore });
    });
    expect(restoreFunc).toHaveBeenCalled();
  });

  it('clear function is called', () => {
    const clearFunc = jasmine.createSpy();
    const hookResult = renderHook(() => useTrashBinReducer<number>(1, 0, undefined, clearFunc))
      .result;
    act(() => {
      hookResult.current[1]({ type: TrashBinActionType.Clear });
    });
    expect(clearFunc).toHaveBeenCalled();
  });
});
