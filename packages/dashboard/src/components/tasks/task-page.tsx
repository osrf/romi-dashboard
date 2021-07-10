/* istanbul ignore file */

import { makeStyles } from '@material-ui/core';
import type { TaskProgress } from 'api-client';
import type { AxiosError } from 'axios';
import React from 'react';
import { TaskPanel, TaskPanelProps } from 'react-components';
import * as RmfModels from 'rmf-models';
import { PlacesContext, RmfIngressContext } from '../rmf-app';
import { useAutoRefresh } from './auto-refresh';

const useStyles = makeStyles((theme) => ({
  taskPanel: {
    padding: `${theme.spacing(4)}px`,
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
}));

export function TaskPage() {
  const classes = useStyles();
  const { tasksApi, sioClient } = React.useContext(RmfIngressContext) || {};
  const [autoRefreshState, autoRefreshDispatcher] = useAutoRefresh(sioClient);
  const [page, setPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const places = React.useContext(PlacesContext);
  const placeNames = places.map((p) => p.vertex.name);

  const fetchTasks = React.useCallback(
    async (page: number) => {
      if (!tasksApi) {
        setTotalCount(0);
        return [];
      }
      const resp = await tasksApi.getTasksTasksGet(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        10,
        page * 10,
        '-priority,-start_time',
      );
      setTotalCount(resp.data.total_count);
      const taskProgresses: TaskProgress[] = resp.data.items;
      return taskProgresses.map((t) => t.task_summary) as RmfModels.TaskSummary[];
    },
    [tasksApi],
  );

  const handleRefresh = React.useCallback<Required<TaskPanelProps>['onRefresh']>(async () => {
    autoRefreshDispatcher.setTasks(await fetchTasks(page));
  }, [fetchTasks, page, autoRefreshDispatcher]);

  React.useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const submitTasks = React.useCallback<Required<TaskPanelProps>['submitTasks']>(
    async (tasks) => {
      if (!tasksApi) {
        throw new Error('tasks api not available');
      }
      await Promise.all(tasks.map((t) => tasksApi.submitTaskTasksSubmitTaskPost(t)));
      handleRefresh();
    },
    [tasksApi, handleRefresh],
  );

  const cancelTask = React.useCallback<Required<TaskPanelProps>['cancelTask']>(
    async (task) => {
      try {
        await tasksApi?.cancelTaskTasksCancelTaskPost({ task_id: task.task_id });
      } catch (e) {
        const axiosErr = e as AxiosError;
        let errMsg = 'unspecified error';
        if (
          axiosErr.response &&
          typeof axiosErr.response.data.detail === 'string' &&
          axiosErr.response.data.detail.length > 0
        ) {
          errMsg = axiosErr.response.data.detail;
        }
        throw new Error(errMsg);
      }
    },
    [tasksApi],
  );

  return (
    <TaskPanel
      className={classes.taskPanel}
      tasks={autoRefreshState.tasks}
      paginationOptions={{
        page,
        count: totalCount,
        rowsPerPage: 10,
        rowsPerPageOptions: [10],
        onChangePage: (_ev, newPage) => setPage(newPage),
      }}
      cleaningZones={placeNames}
      loopWaypoints={placeNames}
      deliveryWaypoints={placeNames}
      submitTasks={submitTasks}
      cancelTask={cancelTask}
      onRefresh={handleRefresh}
      onAutoRefresh={autoRefreshDispatcher.setEnabled}
    />
  );
}
