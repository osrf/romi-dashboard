import {
  Fab,
  FormControlLabel,
  Grid,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { RecurrentRules, RecurrenceType } from '.';
import { PositiveIntField } from '../..';
import { IconButton } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
/**
 * Date hour to hout date timezone
 * Does not repeat | Daily | Weekly on Monday | Monthly on the first Monday | Anually on Month X | Every week day |custom
 * Custom recurrence. Repeat every [number] [week] [day] [month] [year]. Ends On date, after x recurrences.
 */

const useStyles = makeStyles((theme) => ({
  taskList: {
    flex: '1 1 auto',
    // minHeight: 400,
    // maxHeight: '50vh',
    // overflow: 'auto',
  },
  selectedTask: {
    background: theme.palette.action.focus,
  },
}));

export const CustomRecurrence = () => {
  const [recurrence, setRecurrence] = React.useState(1);
  const [recurrenceType, setRecurrenceType] = React.useState('Day');
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecurrenceType(event.target.value as string);
  };

  return (
    <>
      <Grid
        container
        wrap="nowrap"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid
          style={{
            flex: '0 1 5em',
          }}
        >
          <Typography>Repeat Every</Typography>
        </Grid>
        <Grid
          style={{
            flex: '0.5 1 1rem',
          }}
        >
          <PositiveIntField
            id="recurrencenumber"
            label="Recurrence"
            margin="normal"
            variant="outlined"
            value={recurrence}
            onChange={(ev) => {
              setRecurrence(parseInt(ev.target.value) || 0);
            }}
          />
        </Grid>
        <Grid style={{ flexGrow: 1 }}>
          <TextField
            select
            id="recurrencetype"
            label="Type"
            variant="outlined"
            fullWidth
            margin="normal"
            value={recurrenceType || 'Day'}
            onChange={handleChange}
          >
            {RecurrentRules.getBasicRecurrenceTypeList().map((option) => (
              <MenuItem key={option.key} value={option.key as string}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <br />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography>Repeat On</Typography>
        <Fab>S</Fab>
        <Fab color="primary">M</Fab>
        <Fab color="primary">T</Fab>
        <Fab color="primary">W</Fab>
        <Fab color="primary">T</Fab>
        <Fab color="primary">F</Fab>
        <Fab>S</Fab>
      </div>
      <br />
      <div>
        <Typography>Ends</Typography>
        <RadioGroup aria-label="recurrence-ends" value={'never'} onChange={handleChange}>
          <FormControlLabel value="never" control={<Radio />} label="Never" />
          <FormControlLabel value={new Date()} control={<Radio />} label="On" />
          <FormControlLabel value="after" control={<Radio />} label="After" />
        </RadioGroup>
      </div>
    </>
  );
};

interface SchedulerProps {
  onComplete?: () => void;
  currentDate?: Date;
}

const Scheduler = (props: SchedulerProps) => {
  const { onComplete, currentDate } = props;
  const [recurrentValue, setRecurrentValues] = React.useState(
    RecurrenceType.DoesNotRepeat as string,
  );
  const optionList = RecurrentRules.getRecurrenceTypeList(currentDate);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecurrentValues(event.target.value as string);
  };

  return (
    <>
      <TextField
        select
        id="task-scheduler"
        label="Schedule a task"
        variant="outlined"
        fullWidth
        margin="normal"
        value={recurrentValue || RecurrenceType.DoesNotRepeat}
        onChange={handleChange}
      >
        {optionList.map((option) => (
          <MenuItem key={option.key} value={option.key as string}>
            {option.value}
          </MenuItem>
        ))}
      </TextField>
      <br />
      {recurrentValue === RecurrenceType.Custom && <CustomRecurrence />}
    </>
  );
};

export default Scheduler;
