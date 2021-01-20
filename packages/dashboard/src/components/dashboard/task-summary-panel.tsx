import { makeStyles, Typography } from '@material-ui/core';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React from 'react';
import {
  sortTasks,
  TaskSummaryAccordion,
  TrashBinActionType,
  TrashBinControlButtonGroup,
  useTrashBinReducer,
} from 'react-components';
import { mergeContent } from '../../utils';

const debug = Debug('OmniPanel:TaskSummaryPanel');

export interface TaskSummaryAccordionProps {
  tasks: RomiCore.TaskSummary[];
}

export const TaskSummaryPanel = React.memo((props: TaskSummaryAccordionProps) => {
  debug('task summary status panel render');

  const { tasks } = props;
  const classes = useStyles();

  const [savedTasks, dispatchSavedTasks] = useTrashBinReducer<Record<string, RomiCore.TaskSummary>>(
    {},
    {},
    (current, trash) => mergeContent(current, trash, false),
    (current, trash) => mergeContent(trash, current),
  );

  // TODO: we need to synchronize this with a proper backend when it's ready. Now the completed
  // task will be flushed on a browser refresh because they are being saved in memory.
  const handleClearAllCurrTasks = React.useCallback(() => {
    dispatchSavedTasks({ type: TrashBinActionType.Clear });
  }, [dispatchSavedTasks]);

  const handleRestoreTasks = React.useCallback(() => {
    dispatchSavedTasks({ type: TrashBinActionType.Restore });
  }, [dispatchSavedTasks]);

  const tasksExists = React.useMemo(() => {
    return tasks.length !== 0;
  }, [tasks]);

  // Update Task list content
  React.useEffect(() => {
    if (!tasksExists) return;
    let taskSummaryObject: Record<string, RomiCore.TaskSummary> = {};
    tasks.forEach((task) => {
      taskSummaryObject[task.task_id] = task;
    });
    dispatchSavedTasks({
      type: TrashBinActionType.Set,
      payload: (state) => mergeContent(state.current, taskSummaryObject),
    });
  }, [tasks, tasksExists, dispatchSavedTasks]);

  // Order by state and submission time. Order: Active -> Queue -> Failed -> Finished
  const currentTaskContents: RomiCore.TaskSummary[] = React.useMemo(() => {
    return sortTasks(savedTasks.current);
  }, [savedTasks]);

  return (
    <Typography variant="body1" component={'span'}>
      <div className={classes.buttonGroupDiv}>
        <TrashBinControlButtonGroup
          disableClear={!tasksExists}
          disableRestore={!tasksExists}
          onRestoreClick={handleRestoreTasks}
          onClearClick={handleClearAllCurrTasks}
          showSave={false}
          showReset={false}
        />
      </div>
      <TaskSummaryAccordion tasks={currentTaskContents} />
    </Typography>
  );
});

const useStyles = makeStyles(() => ({
  buttonGroupDiv: {
    padding: '0.5rem 1rem',
  },
}));

export default TaskSummaryPanel;
