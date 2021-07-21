import { Paper, TableContainer, TablePagination } from '@material-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { TaskTable, TaskTableProps } from './task-table';
import { makeTask } from './test-data.spec';

const failedTask = makeTask('failed_task', 3, 3);
failedTask.state = RmfModels.TaskSummary.STATE_FAILED;

const completedtasks = Array.from(Array(100)).map((_, idx) => {
  const task = makeTask(`completed_task_${idx}`, 3, 3);
  task.state = RmfModels.TaskSummary.STATE_COMPLETED;
  return task;
});

const tasks = [
  makeTask('active_task', 3, 3),
  makeTask('active_task_2', 4, 3),
  failedTask,
  ...completedtasks,
];

export default {
  title: 'Tasks/Table',
  component: TaskTable,
  argTypes: {
    paginationOptions: {
      control: {
        disable: true,
      },
    },
    submitTask: {
      control: {
        disable: true,
      },
    },
  },
} as Meta;

export const Table: Story<TaskTableProps> = (args) => {
  const [page, setPage] = React.useState(0);
  const count = page >= args.tasks.length / 10 - 1 ? args.tasks.length : -1;

  return (
    <Paper>
      <TableContainer>
        <TaskTable {...args} tasks={args.tasks.slice(page * 10, (page + 1) * 10)} />
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
        page={page}
        onChangePage={(_ev, newPage) => setPage(newPage)}
      />
    </Paper>
  );
};

Table.args = {
  tasks,
};
