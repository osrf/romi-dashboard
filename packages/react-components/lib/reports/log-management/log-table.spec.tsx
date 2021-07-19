import { cleanup, render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import React from 'react';
import { LogLevel } from './log-level';
import { LogRowsType, LogTable } from './log-table';

const rows = [] as LogRowsType;

const logLevels = Object.values(LogLevel);

const getRandomLogLevel = () => {
  const number = Math.floor(Math.random() * logLevels.length);
  return logLevels[number];
};

const timestamp = new Date('Mon Jan  1 00:00:02 UTC 2001');

for (let i = 0; i < 110; i++) {
  rows.push({
    message: 'Test' + i,
    level: getRandomLogLevel().toUpperCase(),
    created: format(timestamp, 'MMM dd yyyy hh:mm aaa'),
    container: { id: 1, name: 'container' },
  });
}

describe('Log table test', () => {
  let root: RenderResult;
  beforeEach(() => {
    root = render(<LogTable rows={rows} />);
  });

  afterEach(cleanup);

  it('formats dates correctly', async () => {
    const tableFirstDateElement = (await root.getAllByTestId('log-table-date'))[0];
    expect(tableFirstDateElement.innerHTML).toBe(format(timestamp, 'MMM dd yyyy hh:mm aaa'));
  });

  it('shows the correct number of rows', () => {
    const allRows = root.container.querySelectorAll('tr').length;
    // -3. from the tr of the table header, filter and pagination table
    expect(allRows - 3).toBe(100);
  });
});

describe('Table footer Pagination', () => {
  beforeEach(() => {
    render(<LogTable rows={rows} />);
  });

  afterEach(cleanup);

  it('show the correct number of rows per page', () => {
    // It's generating an <span> and a <p> on the real dom
    expect(screen.getAllByText('1-100 of 110').length > 1).toBeTruthy();
  });

  it('can change the rows per page', async () => {
    userEvent.click(screen.getByText('100 rows'));
    userEvent.click(screen.getByText('50'));

    expect(screen.getAllByText('1-50 of 110').length > 1).toBeTruthy();
  });

  it('advance page when the `Next Page` button is clicked ', async () => {
    const nextPageButton = screen.queryByTitle('Next Page')?.children[0];
    nextPageButton && userEvent.click(nextPageButton);
    expect(screen.getAllByText('101-110 of 110').length > 1).toBeTruthy();
  });

  it('goes to previous page when the `Previous page` button is clicked ', () => {
    const nextPageButton = screen.queryByTitle('Next Page')?.children[0];
    nextPageButton && userEvent.click(nextPageButton);
    expect(screen.getAllByText('101-110 of 110').length > 1).toBeTruthy();

    const previousPageButton = screen.queryByTitle('Previous Page')?.children[0];
    previousPageButton && userEvent.click(previousPageButton);
    expect(screen.getAllByText('1-100 of 110').length > 1).toBeTruthy();
  });
});

describe('Applies styles to labels correctly', () => {
  const styleRows = [] as LogRowsType;

  for (let i = 0; i < logLevels.length; i++) {
    styleRows.push({
      message: 'Test' + i,
      level: logLevels[i].toUpperCase(),
      created: format(timestamp, 'MMM dd yyyy hh:mm aaa'),
      container: { id: 1, name: 'container' },
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
