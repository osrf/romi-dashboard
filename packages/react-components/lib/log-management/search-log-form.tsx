import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { SearchFilter } from './search-filter';
import DateAndTimePickers from '../date-time-picker';
import { LogLevel } from './log-level';

import moment from 'moment';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { LogQueryPayload } from '.';

interface SearchLogFormProps {
  logLabelValues: { label: string; value: string }[];
  search?: (payload: LogQueryPayload) => void;
}

const logLevelValues = [
  { label: 'FATAL', value: LogLevel.Fatal },
  { label: 'ERROR', value: LogLevel.Error },
  { label: 'WARN', value: LogLevel.Warn },
  { label: 'INFO', value: LogLevel.Info },
  { label: 'DEBUG', value: LogLevel.Debug },
];

export const SearchLogForm = (props: SearchLogFormProps): React.ReactElement => {
  const { search, logLabelValues } = props;
  // The log contains information from different services, the label help us differentiate the service
  const [logLabel, setLogLabel] = React.useState('');
  const [logLevel, setLogLevel] = React.useState(LogLevel.Error);
  const nowDateTime = moment(new Date());
  const [fromLogDate, setFromLogDate] = React.useState<MaterialUiPickersDate>(nowDateTime);
  const [toLogDate, setToLogDate] = React.useState<MaterialUiPickersDate>(nowDateTime);

  const classes = useStyles();

  const searchQuery = () => {
    // If there are no dates, the backend will respond with the number of default logs
    // (the logs could be from previous hours or days)
    search && search({ toLogDate, fromLogDate, logLabel, logLevel });
  };

  const handleLogLabelChange = React.useCallback(
    (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setLogLabel(event.target.value as string);
    },
    [],
  );

  const handleLogLevelChange = React.useCallback(
    (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setLogLevel(event.target.value as LogLevel);
    },
    [],
  );

  const handleFromLogDateChange = React.useCallback((date: MaterialUiPickersDate) => {
    setFromLogDate(date);
  }, []);

  const handleToLogDateChange = React.useCallback((date: MaterialUiPickersDate) => {
    setToLogDate(date);
  }, []);

  return (
    <>
      <div className={classes.searchForm}>
        <SearchFilter
          options={logLabelValues}
          name="log-picker"
          label="Pick Log Label"
          aria-label="log-label-picker"
          handleOnChange={handleLogLabelChange}
          currentValue={logLabel}
        ></SearchFilter>

        <SearchFilter
          options={logLevelValues}
          name="log-level"
          label="Pick Log Level"
          handleOnChange={handleLogLevelChange}
          currentValue={logLevel}
        />

        <DateAndTimePickers
          name="fromLogDate"
          maxDate={new Date()}
          label="From"
          value={fromLogDate}
          onChange={handleFromLogDateChange}
        />
        <DateAndTimePickers
          name="toLogDate"
          maxDate={new Date()}
          label="To"
          value={toLogDate}
          onChange={handleToLogDateChange}
        />
      </div>

      <br></br>
      <Button
        color="primary"
        variant="contained"
        className={classes.searchButton}
        onClick={searchQuery}
      >
        Retrieve Logs
      </Button>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  searchForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    alignItems: 'center',
    justifyItems: 'center',
  },
  searchButton: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
