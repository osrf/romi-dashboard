import React from 'react';
import {
  DateTimePickerProps,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

export default function DateAndTimePickers(props: DateTimePickerProps): React.ReactElement {
  const { name, label, value, ...rest } = props;
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDateTimePicker
        id={`${name}-datetime-local`}
        value={value ? value : new Date().toISOString().substr(0, 16)}
        label={label}
        format="MM/DD/yyyy HH:mm"
        inputVariant="outlined"
        variant="inline"
        ampm={false}
        {...rest}
      />
    </MuiPickersUtilsProvider>
  );
}
