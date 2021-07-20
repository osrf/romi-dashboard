import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import type {
  CleanTaskDescription,
  DeliveryTaskDescription,
  LoopTaskDescription,
  SubmitTask,
} from 'api-client';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { PositiveIntField } from '../form-inputs';
import Scheduler from './scheduler/scheduler';

type TaskDescription = CleanTaskDescription | LoopTaskDescription | DeliveryTaskDescription;

const useStyles = makeStyles((theme) => ({
  selectFileBtn: {
    marginBottom: theme.spacing(1),
  },
  taskList: {
    flex: '1 1 auto',
    minHeight: 400,
    maxHeight: '50vh',
    overflow: 'auto',
  },
  selectedTask: {
    background: theme.palette.action.focus,
  },
}));

function getShortDescription(task: SubmitTask): string {
  switch (task.task_type) {
    case RmfModels.TaskType.TYPE_CLEAN: {
      const desc: CleanTaskDescription = task.description;
      return `[Clean] zone [${desc.cleaning_zone}]`;
    }
    case RmfModels.TaskType.TYPE_DELIVERY: {
      const desc: DeliveryTaskDescription = task.description;
      return `[Delivery] from [${desc.pickup_place_name}] to [${desc.dropoff_place_name}]`;
    }
    case RmfModels.TaskType.TYPE_LOOP: {
      const desc: LoopTaskDescription = task.description;
      return `[Loop] from [${desc.start_name}] to [${desc.finish_name}]`;
    }
    default:
      return `[Unknown] type ${task.task_type}`;
  }
}

interface FormToolbarProps {
  onSelectFileClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function FormToolbar({ onSelectFileClick }: FormToolbarProps) {
  const classes = useStyles();

  return (
    <Grid container wrap="nowrap" alignItems="center">
      <Grid style={{ flexGrow: 1 }}>
        <Typography variant="h6">Create Task</Typography>
      </Grid>
      <Grid>
        <Button
          aria-label="Select File"
          className={classes.selectFileBtn}
          variant="contained"
          color="primary"
          onClick={onSelectFileClick}
        >
          Select File
        </Button>
      </Grid>
    </Grid>
  );
}

interface DeliveryTaskFormProps {
  taskDesc: DeliveryTaskDescription;
  deliveryWaypoints: string[];
  dispensers: string[];
  ingestors: string[];
  onChange(deliveryTaskDescription: DeliveryTaskDescription): void;
}

function DeliveryTaskForm({
  taskDesc,
  deliveryWaypoints,
  dispensers,
  ingestors,
  onChange,
}: DeliveryTaskFormProps) {
  const theme = useTheme();

  return (
    <>
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 60%' }}>
          <Autocomplete
            id="pickup-location"
            freeSolo
            fullWidth
            options={deliveryWaypoints}
            value={taskDesc.pickup_place_name}
            onChange={(_ev, newValue) =>
              onChange({
                ...taskDesc,
                pickup_place_name: newValue,
              })
            }
            onBlur={(ev) =>
              onChange({ ...taskDesc, pickup_place_name: (ev.target as HTMLInputElement).value })
            }
            renderInput={(params) => (
              <TextField {...params} label="Pickup Location" margin="normal" />
            )}
          />
        </Grid>
        <Grid
          style={{
            flex: '1 1 40%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <Autocomplete
            id="dispenser"
            freeSolo
            fullWidth
            options={dispensers}
            value={taskDesc.pickup_dispenser}
            onChange={(_ev, newValue) =>
              onChange({
                ...taskDesc,
                pickup_dispenser: newValue,
              })
            }
            onBlur={(ev) =>
              onChange({ ...taskDesc, pickup_dispenser: (ev.target as HTMLInputElement).value })
            }
            renderInput={(params) => <TextField {...params} label="Dispenser" margin="normal" />}
          />
        </Grid>
      </Grid>
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 60%' }}>
          <Autocomplete
            id="dropoff-location"
            freeSolo
            fullWidth
            options={deliveryWaypoints}
            value={taskDesc.dropoff_place_name}
            onChange={(_ev, newValue) =>
              onChange({
                ...taskDesc,
                dropoff_place_name: newValue,
              })
            }
            onBlur={(ev) =>
              onChange({ ...taskDesc, dropoff_place_name: (ev.target as HTMLInputElement).value })
            }
            renderInput={(params) => (
              <TextField {...params} label="Dropoff Location" margin="normal" />
            )}
          />
        </Grid>
        <Grid
          style={{
            flex: '1 1 40%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <Autocomplete
            id="ingestor"
            freeSolo
            fullWidth
            options={ingestors}
            value={taskDesc.dropoff_ingestor}
            onChange={(_ev, newValue) =>
              onChange({
                ...taskDesc,
                dropoff_ingestor: newValue,
              })
            }
            onBlur={(ev) =>
              onChange({ ...taskDesc, dropoff_ingestor: (ev.target as HTMLInputElement).value })
            }
            renderInput={(params) => <TextField {...params} label="Ingestor" margin="normal" />}
          />
        </Grid>
      </Grid>
    </>
  );
}

interface LoopTaskFormProps {
  taskDesc: LoopTaskDescription;
  loopWaypoints: string[];
  onChange(loopTaskDescription: LoopTaskDescription): void;
}

function LoopTaskForm({ taskDesc, loopWaypoints, onChange }: LoopTaskFormProps) {
  const theme = useTheme();

  return (
    <>
      <Autocomplete
        id="start-location"
        freeSolo
        fullWidth
        options={loopWaypoints}
        value={taskDesc.start_name}
        onChange={(_ev, newValue) =>
          onChange({
            ...taskDesc,
            start_name: newValue,
          })
        }
        onBlur={(ev) =>
          onChange({ ...taskDesc, start_name: (ev.target as HTMLInputElement).value })
        }
        renderInput={(params) => <TextField {...params} label="Start Location" margin="normal" />}
      />
      <Grid container wrap="nowrap">
        <Grid style={{ flex: '1 1 100%' }}>
          <Autocomplete
            id="finish-location"
            freeSolo
            fullWidth
            options={loopWaypoints}
            value={taskDesc.finish_name}
            onChange={(_ev, newValue) =>
              onChange({
                ...taskDesc,
                finish_name: newValue,
              })
            }
            onBlur={(ev) =>
              onChange({ ...taskDesc, finish_name: (ev.target as HTMLInputElement).value })
            }
            renderInput={(params) => (
              <TextField {...params} label="Finish Location" margin="normal" />
            )}
          />
        </Grid>
        <Grid
          style={{
            flex: '0 1 5em',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
          }}
        >
          <PositiveIntField
            id="loops"
            label="Loops"
            margin="normal"
            value={taskDesc.num_loops}
            onChange={(_ev, val) => {
              onChange({
                ...taskDesc,
                num_loops: val,
              });
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

interface CleanTaskFormProps {
  taskDesc: CleanTaskDescription;
  cleaningZones: string[];
  onChange(cleanTaskDescription: CleanTaskDescription): void;
}

function CleanTaskForm({ taskDesc, cleaningZones, onChange }: CleanTaskFormProps) {
  return (
    <Autocomplete
      id="cleaning-zone"
      freeSolo
      fullWidth
      options={cleaningZones}
      value={taskDesc.cleaning_zone}
      onChange={(_ev, newValue) =>
        onChange({
          ...taskDesc,
          cleaning_zone: newValue,
        })
      }
      onBlur={(ev) =>
        onChange({ ...taskDesc, cleaning_zone: (ev.target as HTMLInputElement).value })
      }
      renderInput={(params) => <TextField {...params} label="Cleaning Zone" margin="normal" />}
    />
  );
}

function defaultCleanTask(): CleanTaskDescription {
  return {
    cleaning_zone: '',
  };
}

function defaultLoopsTask(): LoopTaskDescription {
  return {
    start_name: '',
    finish_name: '',
    num_loops: 1,
  };
}

function defaultDeliveryTask(): DeliveryTaskDescription {
  return {
    pickup_place_name: '',
    pickup_dispenser: '',
    dropoff_place_name: '',
    dropoff_ingestor: '',
  };
}

function defaultTaskDescription(taskType?: number): TaskDescription | undefined {
  switch (taskType) {
    case RmfModels.TaskType.TYPE_CLEAN:
      return defaultCleanTask();
    case RmfModels.TaskType.TYPE_LOOP:
      return defaultLoopsTask();
    case RmfModels.TaskType.TYPE_DELIVERY:
      return defaultDeliveryTask();
    default:
      return undefined;
  }
}

function defaultTask(): SubmitTask {
  return {
    description: defaultCleanTask(),
    start_time: Math.floor(Date.now() / 1000),
    task_type: -1,
    priority: 0,
  };
}

export interface CreateTaskFormProps extends DialogProps {
  /**
   * Shows extra UI elements suitable for submittng batched tasks. Default to 'false'.
   */
  allowBatch?: boolean;
  cleaningZones?: string[];
  loopWaypoints?: string[];
  deliveryWaypoints?: string[];
  dispensers?: string[];
  ingestors?: string[];
  submitTasks?(tasks: SubmitTask[]): Promise<void>;
  tasksFromFile?(): Promise<SubmitTask[]> | SubmitTask[];
  onSuccess?(tasks: SubmitTask[]): void;
  onFail?(error: Error, tasks: SubmitTask[]): void;
  onCancelClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function CreateTaskForm({
  cleaningZones = [],
  loopWaypoints = [],
  deliveryWaypoints = [],
  dispensers = [],
  ingestors = [],
  submitTasks,
  tasksFromFile,
  onSuccess,
  onFail,
  onCancelClick,
  ...dialogProps
}: CreateTaskFormProps): JSX.Element {
  const theme = useTheme();
  const classes = useStyles();
  const [tasks, setTasks] = React.useState<SubmitTask[]>(() => [defaultTask()]);
  const [selectedTaskIdx, setSelectedTaskIdx] = React.useState(0);
  const taskTitles = React.useMemo(
    () => tasks && tasks.map((t, i) => `${i + 1}: ${getShortDescription(t)}`),
    [tasks],
  );
  const [submitting, setSubmitting] = React.useState(false);
  const task = tasks[selectedTaskIdx];

  const updateTasks = () => {
    setTasks((prev) => {
      prev.splice(selectedTaskIdx, 1, task);
      return [...prev];
    });
  };

  const handleTaskDescriptionChange = (newType: number, newDesc: TaskDescription) => {
    task.task_type = newType;
    task.description = newDesc;
    updateTasks();
  };

  const renderTaskDescriptionForm = () => {
    if (task.task_type === -1) {
      return null;
    }
    switch (task.task_type) {
      case RmfModels.TaskType.TYPE_CLEAN:
        return (
          <CleanTaskForm
            taskDesc={task.description as CleanTaskDescription}
            cleaningZones={cleaningZones}
            onChange={(desc) => handleTaskDescriptionChange(RmfModels.TaskType.TYPE_CLEAN, desc)}
          />
        );
      case RmfModels.TaskType.TYPE_LOOP:
        return (
          <LoopTaskForm
            taskDesc={task.description as LoopTaskDescription}
            loopWaypoints={loopWaypoints}
            onChange={(desc) => handleTaskDescriptionChange(RmfModels.TaskType.TYPE_LOOP, desc)}
          />
        );
      case RmfModels.TaskType.TYPE_DELIVERY:
        return (
          <DeliveryTaskForm
            taskDesc={task.description as DeliveryTaskDescription}
            deliveryWaypoints={deliveryWaypoints}
            dispensers={dispensers}
            ingestors={ingestors}
            onChange={(desc) => handleTaskDescriptionChange(RmfModels.TaskType.TYPE_DELIVERY, desc)}
          />
        );
      default:
        return null;
    }
  };

  const handleTaskTypeChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newType = parseInt(ev.target.value);
    const newDesc = defaultTaskDescription(newType);
    if (newDesc === undefined) {
      return;
    }
    task.description = newDesc;
    task.task_type = newType;
    updateTasks();
  };

  // no memo because deps would likely change
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    (async () => {
      if (!submitTasks) {
        onSuccess && onSuccess(tasks);
        return;
      }
      setSubmitting(true);
      try {
        setSubmitting(true);
        await submitTasks(tasks);
        onSuccess && onSuccess(tasks);
      } catch (e) {
        onFail && onFail(e, tasks);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const handleSelectFileClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!tasksFromFile) {
      return;
    }
    (async () => {
      const newTasks = await tasksFromFile();
      if (newTasks.length === 0) {
        return;
      }
      setTasks(newTasks);
      setSelectedTaskIdx(0);
    })();
  };

  const submitText = tasks.length > 1 ? 'Submit All' : 'Submit';

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Dialog {...dialogProps} maxWidth="md" fullWidth={tasks.length > 1}>
        <form>
          <DialogTitle>
            <FormToolbar onSelectFileClick={handleSelectFileClick} />
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container direction="row" wrap="nowrap">
              <Grid>
                <TextField
                  select
                  id="task-type"
                  label="Task Type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={task.task_type !== -1 ? task.task_type : ''}
                  onChange={handleTaskTypeChange}
                >
                  <MenuItem value={RmfModels.TaskType.TYPE_CLEAN}>Clean</MenuItem>
                  <MenuItem value={RmfModels.TaskType.TYPE_LOOP}>Loop</MenuItem>
                  <MenuItem value={RmfModels.TaskType.TYPE_DELIVERY}>Delivery</MenuItem>
                </TextField>
                <Grid container wrap="nowrap">
                  <Grid style={{ flexGrow: 1 }}>
                    <KeyboardDateTimePicker
                      id="start-time"
                      value={new Date(task.start_time * 1000)}
                      onChange={(date) => {
                        if (!date) {
                          return;
                        }
                        // FIXME: needed because dateio typings default to moment
                        task.start_time = Math.floor(((date as unknown) as Date).getTime() / 1000);
                        updateTasks();
                      }}
                      label="Start Time"
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    style={{
                      flex: '0 1 5em',
                      marginLeft: theme.spacing(2),
                      marginRight: theme.spacing(2),
                    }}
                  >
                    <PositiveIntField
                      id="priority"
                      label="Priority"
                      margin="normal"
                      value={task.priority || 0}
                      onChange={(_ev, val) => {
                        task.priority = val;
                        updateTasks();
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container wrap="nowrap">
                  <Grid style={{ flexGrow: 1 }}>
                    <Scheduler currentDate={new Date(task.start_time * 1000)}></Scheduler>
                  </Grid>
                  {/* <Grid
                    style={{
                      flex: '0 1 5em',
                      marginLeft: theme.spacing(2),
                      marginRight: theme.spacing(2),
                    }}
                  >
                    <PositiveIntField
                      id="priority"
                      label="Priority"
                      margin="normal"
                      value={priorityInput}
                      onChange={(ev) => {
                        task.priority = parseInt(ev.target.value) || 0;
                        updateTasks();
                        setPriorityInput(ev.target.value);
                      }}
                    />
                  </Grid> */}
                </Grid>

                {renderTaskDescriptionForm()}
              </Grid>
              {taskTitles.length > 1 && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
                  />
                  <List dense className={classes.taskList} aria-label="Tasks List">
                    {taskTitles.map((title, idx) => (
                      <ListItem
                        key={idx}
                        button
                        onClick={() => setSelectedTaskIdx(idx)}
                        className={selectedTaskIdx === idx ? classes.selectedTask : undefined}
                        role="listitem button"
                      >
                        <ListItemText primary={title} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              disabled={submitting}
              onClick={onCancelClick}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              style={{ margin: theme.spacing(1) }}
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              onClick={handleSubmit}
              aria-label={submitText}
            >
              <Typography
                style={{ visibility: submitting ? 'hidden' : 'visible' }}
                variant="button"
              >
                {submitText}
              </Typography>
              <CircularProgress
                style={{ position: 'absolute', visibility: submitting ? 'visible' : 'hidden' }}
                color="inherit"
                size="1.8em"
              />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MuiPickersUtilsProvider>
  );
}
