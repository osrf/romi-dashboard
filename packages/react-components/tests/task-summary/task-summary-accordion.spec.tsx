import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { act, render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TaskSummaryAccordion, TaskSummaryAccordionInfo } from '../../lib';
import {
  getActorFromStatus,
  sortTasks,
  sortTasksBySubmissionTime,
} from '../../lib/task-summary/task-summary-utils';

function getTaskObject(): Record<string, RomiCore.TaskSummary> {
  // Returns a task object with a new memory allocation
  return {
    task1: {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 1,
      status:
        'Moving [tinyRobot/tinyRobot1]: ( 9.81228 -6.98942 -3.12904) -> ( 6.26403 -3.51569  1.16864) | Remaining phases: 1 | Remaining phases: 6',
      submission_time: { sec: 0, nanosec: 500 },
      task_id: 'task1',
    },
    task2: {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 1,
      status:
        'Moving [tinyRobot/tinyRobot2]: ( 9.81228 -6.98942 -3.12904) -> ( 6.26403 -3.51569  1.16864) | Remaining phases: 1 | Remaining phases: 6',
      submission_time: { sec: 0, nanosec: 1000 },
      task_id: 'task2',
    },
    task3: {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 0,
      status:
        'Moving [tinyRobot/tinyRobot3]: ( 9.81228 -6.98942 -3.12904) -> ( 6.26403 -3.51569  1.16864) | Remaining phases: 1 | Remaining phases: 6',
      submission_time: { sec: 0, nanosec: 1500 },
      task_id: 'task3',
    },
  };
}

describe('Renders correctly', () => {
  let task: RomiCore.TaskSummary;
  beforeEach(() => {
    task = Object.values(getTaskObject())[0];
  });

  it('Renders tree items', () => {
    const tasks = Object.values(getTaskObject());
    const root = render(<TaskSummaryAccordion tasks={tasks} />);
    tasks.forEach((task) => {
      expect(root.getByText(task.task_id).textContent).toBe(task.task_id);
    });
  });

  it('Show description below the id if the task has an actor', () => {
    const root = render(<TaskSummaryAccordion tasks={[task]} />);
    const actor = getActorFromStatus(task.status);
    if (!actor) throw new Error('An actor is required to run this test');
    const classes = root.getByText(actor[0]).className;
    expect(classes).toContain('makeStyles-taskActor');
  });

  it('Does not show description below the id if the task has no actor', () => {
    task.status = 'Finished';
    const root = render(<TaskSummaryAccordion tasks={[task]} />);
    expect(root.container.querySelector('[id=task-actor]')).toBeFalsy();
  });
});

describe('Components gets the correct style on specifics states', () => {
  let task: RomiCore.TaskSummary;
  beforeEach(() => {
    task = Object.values(getTaskObject())[0];
  });

  it('Active style is applied ', () => {
    task.state = RomiCore.TaskSummary.STATE_ACTIVE;
    const root = render(<TaskSummaryAccordion tasks={[task]} />);
    expect(root.getByText(task.task_id).parentElement?.className).toContain('makeStyles-active');
  });

  it('Queue style is applied', () => {
    task.state = RomiCore.TaskSummary.STATE_QUEUED;
    const root = render(<TaskSummaryAccordion tasks={[task]} />);
    expect(root.getByText(task.task_id).parentElement?.className).toContain('makeStyles-queued');
  });

  it('Completed style is applied', () => {
    task.state = RomiCore.TaskSummary.STATE_COMPLETED;
    const root = render(<TaskSummaryAccordion tasks={[task]} />);
    expect(root.getByText(task.task_id).parentElement?.className).toContain('makeStyles-completed');
  });

  it('Failed style is applied', () => {
    task.state = RomiCore.TaskSummary.STATE_FAILED;
    const root = render(<TaskSummaryAccordion tasks={[task]} />);
    expect(root.getByText(task.task_id).parentElement?.className).toContain('makeStyles-failed');
  });
});

describe('Components gets the correct label on specifics states', () => {
  let task: RomiCore.TaskSummary;
  beforeEach(() => {
    task = Object.values(getTaskObject())[0];
  });

  it('Shows ACTIVE label', () => {
    task.state = RomiCore.TaskSummary.STATE_ACTIVE;
    const root = render(<TaskSummaryAccordionInfo task={task} />);
    expect(root.getByText('ACTIVE')).toBeTruthy();
  });

  it('Shows QUEUE label', () => {
    task.state = RomiCore.TaskSummary.STATE_QUEUED;
    const root = render(<TaskSummaryAccordionInfo task={task} />);
    expect(root.getByText('QUEUED')).toBeTruthy();
  });

  it('Shows COMPLETED label', () => {
    task.state = RomiCore.TaskSummary.STATE_COMPLETED;
    const root = render(<TaskSummaryAccordionInfo task={task} />);
    expect(root.getByText('COMPLETED')).toBeTruthy();
  });

  it('Shows FAILED label', () => {
    task.state = RomiCore.TaskSummary.STATE_FAILED;
    const root = render(<TaskSummaryAccordionInfo task={task} />);
    expect(root.getByText('FAILED')).toBeTruthy();
  });
});

describe('Sort Tasks', () => {
  it('Sorts a task list by state correctly', () => {
    const tasks = getTaskObject();
    tasks['test1'] = {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 2,
      status: 'test1',
      submission_time: { sec: 0, nanosec: 0 },
      task_id: 'test1',
    };
    tasks['test2'] = {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 3,
      status: 'test2',
      submission_time: { sec: 0, nanosec: 0 },
      task_id: 'test2',
    };
    const sortedTasks = sortTasks(tasks);
    expect(sortedTasks[0].state).toBe(RomiCore.TaskSummary.STATE_ACTIVE);
    expect(sortedTasks[1].state).toBe(RomiCore.TaskSummary.STATE_ACTIVE);
    expect(sortedTasks[2].state).toBe(RomiCore.TaskSummary.STATE_QUEUED);
    expect(sortedTasks[3].state).toBe(RomiCore.TaskSummary.STATE_FAILED);
    expect(sortedTasks[4].state).toBe(RomiCore.TaskSummary.STATE_COMPLETED);
  });

  it('Sorts a task list by submission time correctly', () => {
    const tasks = Object.values(getTaskObject());
    const sortedTasks = sortTasksBySubmissionTime(tasks);
    expect(sortedTasks[0].submission_time.nanosec).toBe(1500);
    expect(sortedTasks[1].submission_time.nanosec).toBe(1000);
    expect(sortedTasks[2].submission_time.nanosec).toBe(500);
  });

  it('Sorts a task list by state and submission time correctly', () => {
    const sortedTasks = sortTasks(getTaskObject());
    expect(sortedTasks[0].task_id).toBe('task2');
    expect(sortedTasks[1].task_id).toBe('task1');
    expect(sortedTasks[2].task_id).toBe('task3');
  });
});

describe('user interactions', () => {
  let tasks: RomiCore.TaskSummary[];
  beforeEach(() => {
    tasks = Object.values(getTaskObject());
  });

  function getHeader(container: Element) {
    return container.querySelector('.MuiTreeItem-content');
  }

  it('toggle expands when clicked', async () => {
    const root = render(<TaskSummaryAccordion tasks={[tasks[0]]} />);
    const header = getHeader(root.container)!;
    expect(header).toBeTruthy();
    act(() => {
      userEvent.click(header);
    });
    expect(root.queryAllByRole('row', { hidden: false }).length).toBeTruthy();

    act(() => {
      userEvent.click(getHeader(root.container)!);
    });
    await waitForElementToBeRemoved(() => root.queryAllByRole('row', { hidden: false }), {
      timeout: 1000,
    });
  });
});

it('Gets the name of the actor from the status', () => {
  const rawStatus = 'Finding a plan for [tinyRobot/tinyRobot1] to go to [23] | Remaining phases: 6';
  const actor = getActorFromStatus(rawStatus);
  expect(actor).toEqual(['[tinyRobot/tinyRobot1]']);
});
