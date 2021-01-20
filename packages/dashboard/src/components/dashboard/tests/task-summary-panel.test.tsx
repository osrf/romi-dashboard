import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import fakeTaskSummary from '../../../mock/data/task-summary';
import TaskSummaryPanel from '../task-summary-panel';

describe('It renders correctly', () => {
  test('Renders tree items', () => {
    const tasks = Object.values(fakeTaskSummary());
    const root = render(<TaskSummaryPanel tasks={tasks} />);
    tasks.forEach((task) => {
      expect(root.getByText(task.task_id).textContent).toBe(task.task_id);
    });
  });
});

describe('Button Bar working correctly', () => {
  test('should set disabled to true on buttons when empty tasks is provided', () => {
    const root = render(<TaskSummaryPanel tasks={[]} />);
    expect(
      root.container.querySelector('button#clear-button')?.hasAttribute('disabled'),
    ).toBeTruthy();
    expect(
      root.container.querySelector('button#restore-button')?.hasAttribute('disabled'),
    ).toBeTruthy();
  });

  test('should set disabled to false on buttons when tasks are provided', () => {
    const tasks = Object.values(fakeTaskSummary());
    const root = render(<TaskSummaryPanel tasks={tasks} />);
    expect(
      root.container.querySelector('button#clear-button')?.hasAttribute('disabled'),
    ).toBeFalsy();
    expect(
      root.container.querySelector('button#restore-button')?.hasAttribute('disabled'),
    ).toBeFalsy();
  });

  test('should empty all current tasks when clear button is clicked', () => {
    const tasks = Object.values(fakeTaskSummary());
    const root = render(<TaskSummaryPanel tasks={tasks} />);
    userEvent.click(root.getByText('Clear'));
    expect(root.container.querySelector('li')).toBeFalsy();
  });

  test('should render all tasks when restore button is clicked', () => {
    const tasks = Object.values(fakeTaskSummary());
    const root = render(<TaskSummaryPanel tasks={tasks} />);
    // clear all tasks first to ensure empty array
    userEvent.click(root.getByText('Clear'));
    expect(root.container.querySelector('li')).toBeFalsy();
    userEvent.click(root.getByText('Restore'));
    tasks.forEach((task) => {
      expect(root.getByText(task.task_id).textContent).toBe(task.task_id);
    });
  });
});
