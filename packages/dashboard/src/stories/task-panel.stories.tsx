import { Meta, Story } from '@storybook/react';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { UserContext } from '../components/auth/contexts';
import { TaskPanel } from '../components/tasks/task-panel';
import { makeTask } from '../components/tasks/tests/make-tasks';

export default {
  title: 'Tasks/Task Panel',
  component: TaskPanel,
  argTypes: {
    roles: {
      name: 'roles',
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    controls: {
      include: [],
    },
  },
} as Meta;

const failedTask = makeTask('failed_task', 3, 3);
failedTask.summary.state = RmfModels.TaskSummary.STATE_FAILED;

const completedtasks = Array.from(Array(100)).map((_, idx) => {
  const task = makeTask(`completed_task_${idx}`, 3, 3);
  task.summary.state = RmfModels.TaskSummary.STATE_COMPLETED;
  return task;
});

const tasks = [
  makeTask('active_task', 3, 3),
  makeTask('active_task_2', 4, 3),
  failedTask,
  ...completedtasks,
];

interface StoryArgs {
  roles: string[];
}

export const ExampleTaskPanel: Story<StoryArgs> = (args) => {
  const [page, setPage] = React.useState(0);
  return (
    <UserContext.Provider
      value={{ profile: { username: 'story', is_admin: true, roles: [] }, permissions: [] }}
    >
      <TaskPanel
        cleaningZones={['test_zone_0', 'test_zone_1']}
        loopWaypoints={['test_waypoint_0', 'test_waypoint_1']}
        deliveryWaypoints={['test_waypoint_0', 'test_waypoint_1']}
        dispensers={['test_dispenser_0', 'test_dispenser_1']}
        ingestors={['test_ingestor_0', 'test_ingestor_1']}
        tasks={tasks.slice(page * 10, page * 10 + 10)}
        paginationOptions={{
          page,
          count: tasks.length,
          rowsPerPage: 10,
          rowsPerPageOptions: [10],
          onChangePage: (_ev, newPage) => setPage(newPage),
        }}
        style={{ height: '95vh', margin: 'auto', maxWidth: 1600 }}
        submitTasks={() => new Promise((res) => setTimeout(res, 1000))}
        cancelTask={() => new Promise((res) => setTimeout(res, 1000))}
      />
    </UserContext.Provider>
  );
};
