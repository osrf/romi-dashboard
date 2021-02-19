import { screen, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import moment from 'moment';
import { LogRowsType, LogLevel, LogTable } from '../../lib';

const rows = [] as LogRowsType;

const logLevels = Object.values(LogLevel);

const getRandomLogLevel = () => {
  const number = Math.floor(Math.random() * logLevels.length);
  return logLevels[number];
};

const timestamp = new Date('Mon Jan  1 00:00:02 UTC 2001').toISOString();

for (let i = 0; i < 110; i++) {
  rows.push({
    message: 'Test' + i,
    level: getRandomLogLevel().toUpperCase(),
    timestamp: timestamp,
  });
}

describe('Log table test', () => {
  let root: RenderResult;
  beforeEach(() => {
    root = render(<LogTable rows={rows} />);
  });

  it('formats dates correctly', async () => {
    const tableFirstDateElement = (await root.getAllByTestId('log-table-date'))[0];
    expect(tableFirstDateElement.innerHTML).toBe(moment(timestamp).format('lll'));
  });

  it('shows the correct number of rows', () => {
    const allRows = root.container.querySelectorAll('tr').length;
    // -3. from the tr of the table header, filter and pagination table
    expect(allRows - 3).toBe(100);
  });
});

describe('Table footer Pagination', () => {
  let root: RenderResult;
  beforeEach(() => {
    root = render(<LogTable rows={rows} />);
  });
  it('show the correct number of rows per page', () => {
    expect(root.findByLabelText('1-100 of 110')).toBeTruthy();
  });

  it('can change the rows per page', async () => {
    userEvent.click(root.getByText('100 rows'));
    userEvent.click(root.getByText('50'));

    expect(root.findByLabelText('1-50 of 110')).toBeTruthy();
  });

  it('advance page when the `Next page` button is clicked ', () => {
    userEvent.click(root.getByTitle('Next Page'));
    expect(root.findByLabelText('101-110 of 110')).toBeTruthy();
  });

  it('goes to previous page when the `Previous page` button is clicked ', () => {
    userEvent.click(root.getByTitle('Next Page'));
    expect(root.findByLabelText('101-110 of 110')).toBeTruthy();
    userEvent.click(root.getByTitle('Previous Page'));
    expect(root.findByLabelText('1-100 of 110')).toBeTruthy();
  });
});

describe('Applies styles to labels correctly', () => {
  const styleRows = [] as LogRowsType;

  for (let i = 0; i < logLevels.length; i++) {
    styleRows.push({
      message: 'Test' + i,
      level: logLevels[i].toUpperCase(),
      timestamp: timestamp,
    });
  }

  beforeEach(() => {
    render(<LogTable rows={styleRows} />);
  });

  it('set the style correctly when the label ERROR ', () => {
    expect(screen.getByText('ERROR').className).toContain('makeStyles-error');
  });

  it('set the style correctly when the label DEBUG ', () => {
    expect(screen.getByText('DEBUG').className).toContain('makeStyles-debug');
  });

  it('set the style correctly when the label WARN ', () => {
    expect(screen.getByText('WARN').className).toContain('makeStyles-warn');
  });

  it('set the style correctly when the label FATAL ', () => {
    expect(screen.getByText('FATAL').className).toContain('makeStyles-error');
  });
});
