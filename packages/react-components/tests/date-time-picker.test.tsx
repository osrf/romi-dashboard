import React from 'react';
import { render } from '@testing-library/react';
import DateAndTimePickers from '../lib/date-time-picker';
import moment from 'moment';

describe('date time picker', () => {
  it('shows the correct Label', async () => {
    const handleDateChange = jest.fn();
    const timestamp = new Date('Mon Jan  1 00:00:02 UTC 2001').toISOString().substr(0, 16);
    const root = render(
      <DateAndTimePickers
        name={'picker'}
        label={'Test'}
        value={timestamp}
        onChange={handleDateChange}
      />,
    );
    expect(await root.findByLabelText('Test')).toBeTruthy();
  });

  it('shows the current date if `date` parameter is undefined', () => {
    const handleDateChange = jest.fn();
    const currentDate = moment(new Date().toISOString().substr(0, 16)).format('MM/DD/yyyy HH:mm');

    const root = render(
      <DateAndTimePickers
        name={'picker'}
        label={'test'}
        value={undefined}
        onChange={handleDateChange}
      />,
    );
    const datePicker = root.container.querySelector('#picker-datetime-local');
    expect(datePicker?.getAttribute('value')).toBe(currentDate);
  });
});
