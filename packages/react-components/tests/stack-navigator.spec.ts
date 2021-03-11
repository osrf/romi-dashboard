import { act, renderHook, RenderResult } from '@testing-library/react-hooks/dom';
import { StackNavigatorDispatch, useStackNavigator } from '../lib';

let hookResult: RenderResult<[number[], StackNavigatorDispatch<number>]>;
let stackDispatch: StackNavigatorDispatch<number>;

beforeEach(() => {
  hookResult = renderHook(() => useStackNavigator([0], 0)).result;
  stackDispatch = hookResult.current[1];
});

it('push', () => {
  act(() => stackDispatch.push(10));
  const stack = hookResult.current[0];
  expect(stack).toHaveSize(2);
  expect(stack[0]).toBe(0);
  expect(stack[1]).toBe(10);
});

it('pop does not remove last item', () => {
  act(() => {
    stackDispatch.push(2);
    stackDispatch.pop();
    stackDispatch.pop();
  });
  const stack = hookResult.current[0];
  expect(stack).toHaveSize(1);
  expect(stack[0]).toBe(0);
});

it('reset returns the stack to the initial state', () => {
  act(() => {
    stackDispatch.push(2);
    stackDispatch.push(3);
  });
  expect(hookResult.current[0]).toHaveSize(3);
  act(() => {
    stackDispatch.reset();
  });
  expect(hookResult.current[0]).toHaveSize(1);
  expect(hookResult.current[0][0]).toBe(0);
});

it('home pushes the home view onto the stack', () => {
  act(() => {
    stackDispatch.push(2);
    stackDispatch.push(3);
  });
  expect(hookResult.current[0]).toHaveSize(3);
  act(() => {
    stackDispatch.home();
  });
  expect(hookResult.current[0]).toHaveSize(4);
  expect(hookResult.current[0][3]).toBe(0);
});
