import { render } from '@testing-library/react';
import React from 'react';
import { SearchLogForm } from '../../lib';
import moment from 'moment';

describe('Search log form tests', () => {
  const logLabel = [
    { label: 'Web Server', value: 'web-server' },
    { label: 'RMF core', value: 'rmf-core' },
  ];

  it('smoke test', () => {
    render(<SearchLogForm logLabelValues={logLabel}></SearchLogForm>);
  });

  it('places correctly initial values', () => {
    const root = render(<SearchLogForm logLabelValues={logLabel}></SearchLogForm>);
    expect(root.getByText('ERROR')).toBeTruthy();
    const currentDate = moment(new Date()).format('MM/DD/yyyy HH:mm');
    const fromLogDate = root.container.querySelector('#fromLogDate-datetime-local');
    expect(fromLogDate?.getAttribute('value')).toBe(currentDate);
    const toLogDate = root.container.querySelector('#toLogDate-datetime-local');
    expect(toLogDate?.getAttribute('value')).toBe(currentDate);
  });
});
