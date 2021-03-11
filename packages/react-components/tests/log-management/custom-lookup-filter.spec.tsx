import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CustomLookupFilter, CustomLookupFilterParser } from '../../lib';

describe('Custom Lookup filter parser', () => {
  const columnDef = {
    level: 'Error',
    message: 'test',
    timestamp: new Date().toString(),
    tableData: {
      id: 1,
      filterValue: ['error'],
    },
    filterOnItemSelect: jasmine.createSpy(),
    lookup: { error: 'error', warn: 'warn' },
  };

  it('smoke test', () => {
    const mockOnChange = jasmine.createSpy();
    render(<CustomLookupFilterParser columnDef={columnDef} onFilterChanged={mockOnChange} />);
    cleanup();
  });
});

describe('Custom Lookup filter', () => {
  let mockOnChange: ReturnType<typeof jasmine.createSpy>;
  beforeEach(() => {
    mockOnChange = jasmine.createSpy();
  });

  afterEach(() => {
    cleanup();
  });

  it('triggers a new search on filter change', () => {
    render(
      <CustomLookupFilter
        tableId={1}
        filterValue={['error']}
        filterOnItemSelect={true}
        lookup={{ error: 'error', warn: 'warn' }}
        onFilterChanged={mockOnChange}
      />,
    );
    userEvent.click(screen.getByText('error'));
    userEvent.click(screen.getByText('warn'));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('does not trigger a new search on filter change', () => {
    render(
      <CustomLookupFilter
        tableId={1}
        filterValue={['error']}
        filterOnItemSelect={false}
        lookup={{ error: 'error', warn: 'warn' }}
        onFilterChanged={mockOnChange}
      />,
    );
    userEvent.click(screen.getByText('error'));
    userEvent.click(screen.getByText('warn'));
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  it('triggers a new search closing the filter selector', () => {
    render(
      <CustomLookupFilter
        tableId={1}
        filterValue={['error']}
        filterOnItemSelect={false}
        lookup={{ error: 'error', warn: 'warn' }}
        onFilterChanged={mockOnChange}
      />,
    );
    userEvent.click(screen.getByText('error'));
    userEvent.click(screen.getByText('warn'));
    userEvent.type(screen.getByText('warn'), '{esc}');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
