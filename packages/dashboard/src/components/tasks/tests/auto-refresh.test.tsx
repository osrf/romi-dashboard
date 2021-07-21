import { act, renderHook } from '@testing-library/react-hooks';
import { Listener, SioClient } from 'api-client';
import * as RmfModels from 'rmf-models';
import { useAutoRefresh } from '../auto-refresh';
import { makeTask } from '../tests/make-tasks';

function makeTasks(...taskIds: string[]) {
  return taskIds.map((id) => makeTask(id, 1, 1));
}

describe('auto refresh hook', () => {
  let mockSubscribe: jest.Mock;
  let mockUnsub: jest.Mock;
  let sioClient: SioClient;

  beforeEach(() => {
    mockSubscribe = jest.fn().mockImplementation((_, listener) => listener);
    mockUnsub = jest.fn();
    sioClient = ({
      subscribeTaskSummary: mockSubscribe,
      unsubscribe: mockUnsub,
    } as Partial<SioClient>) as SioClient;
  });

  it('smoke test', () => {
    const { result } = renderHook(() => useAutoRefresh(sioClient, undefined, false));
    let [state, dispatch] = result.current;

    // mockSubscribe not called because auto refresh is disabled
    // auto refresh should be disabled by default
    act(() => {
      dispatch.setTasks(makeTasks('task1', 'task2'));
    });
    [state, dispatch] = result.current;
    expect(state.tasks).toHaveLength(2);
    expect(mockSubscribe).not.toHaveBeenCalled();

    // it should subscribe to the task events when auto refresh is enabled
    act(() => {
      dispatch.setEnabled(true);
    });
    [state, dispatch] = result.current;
    expect(state.tasks).toHaveLength(2);
    expect(state.enabled).toBe(true);
    expect(mockSubscribe).toHaveBeenCalledTimes(2);
    const subscribedTasks = mockSubscribe.mock.calls.map((args) => args[0]);
    expect(subscribedTasks).toContain('task1');
    expect(subscribedTasks).toContain('task2');

    // tasks should be unsubscribed when auto refresh is disabled
    act(() => {
      dispatch.setEnabled(false);
    });
    [state, dispatch] = result.current;
    expect(mockSubscribe).toHaveBeenCalledTimes(2);
    expect(mockUnsub).toHaveBeenCalledTimes(2);
    const subscriptions = mockSubscribe.mock.calls.map((args) => args[1]);
    expect(mockUnsub).toHaveBeenCalledWith(subscriptions[0]);
    expect(mockUnsub).toHaveBeenCalledWith(subscriptions[1]);
  });

  it('change subscriptions when tasks changes', () => {
    const { result } = renderHook(() =>
      useAutoRefresh(sioClient, makeTasks('task1', 'task2'), true),
    );
    let dispatch = result.current[1];
    expect(mockSubscribe).toHaveBeenCalledTimes(2);

    act(() => {
      dispatch.setTasks(makeTasks('task3', 'task4'));
    });
    expect(mockSubscribe).toHaveBeenCalledTimes(4);
    const subscribeCalls = mockSubscribe.mock.calls;
    const newTaskIds = subscribeCalls.slice(2).map((args) => args[0]);
    expect(newTaskIds).toContain('task3');
    expect(newTaskIds).toContain('task4');
    const subscriptions = subscribeCalls.map((args) => args[1]);
    expect(mockUnsub).toHaveBeenCalledTimes(2);
    expect(mockUnsub).toHaveBeenCalledWith(subscriptions[0]);
    expect(mockUnsub).toHaveBeenCalledWith(subscriptions[1]);
  });

  it('update tasks when on new task summary', () => {
    const task = makeTask('task1', 1, 1);
    task.summary.state = RmfModels.TaskSummary.STATE_PENDING;

    mockSubscribe = jest.fn().mockImplementation((_, listener: Listener<RmfModels.TaskSummary>) => {
      listener({ ...task.summary, state: RmfModels.TaskSummary.STATE_QUEUED });
    });
    sioClient.subscribeTaskSummary = mockSubscribe;

    const { result } = renderHook(() => useAutoRefresh(sioClient, [task], true));
    const state = result.current[0];
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].summary.state).toBe(RmfModels.TaskSummary.STATE_QUEUED);
    // check that no extra subscribe/unsubscribe is made when task is updated.
    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    expect(mockUnsub).not.toHaveBeenCalled();
  });
});
