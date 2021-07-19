import React from 'react';
import MaterialTable, { Column } from 'material-table';
import { CustomLookupFilterParser, LogLevel } from '.';
import { makeStyles, Typography } from '@material-ui/core';
import { materialTableIcons } from '../../material-table-icons';
import { format } from 'date-fns';

export type ContainerType = {
  id: number;
  name: string;
};

export type LogRowsType = {
  level: string;
  message: string;
  created: string;
  container: ContainerType;
}[];

export interface LogTableProps {
  rows: LogRowsType | [];
  tableSize?: string; // units vh or rem
  addMoreRows?(): void;
}

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
  },
  debug: {
    color: theme.palette.secondary.dark,
  },
  warn: {
    color: theme.palette.warning.light,
  },
  info: {
    color: theme.palette.info.main,
  },
  cellContent: {
    display: 'block',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
  },
}));

export const LogTable = (props: LogTableProps): React.ReactElement => {
  const { rows, tableSize, addMoreRows } = props;
  const classes = useStyles();
  const getLogLevelStyle = (level: string): string | undefined => {
    level = level.toLowerCase();
    switch (level) {
      case LogLevel.Error:
        return classes.error;
      case LogLevel.Warn:
        return classes.warn;
      case LogLevel.Fatal:
        return classes.error;
      case LogLevel.Debug:
        return classes.debug;
      case LogLevel.Info:
        return classes.info;
      default:
        return undefined;
    }
  };

  // FIXME: we cannot copy the LogLevel Enum directly and remove the all attribute because it has a protected attribute.
  const logLevels = React.useMemo(() => {
    const logLevelCopy: Record<string, string> = {};
    Object.keys(LogLevel).forEach((element: string) => {
      logLevelCopy[element] = LogLevel[element as keyof typeof LogLevel];
    });
    delete logLevelCopy['All'];
    return logLevelCopy;
  }, []);

  return (
    <MaterialTable
      title="Log Result"
      icons={materialTableIcons}
      columns={[
        {
          title: <Typography>Level</Typography>,
          field: 'level',
          type: 'string',
          align: 'center',
          cellStyle: { padding: '0px', width: '2rem', maxWidth: '2rem' },
          headerStyle: {
            width: '2rem',
            maxWidth: '2rem',
          },
          filterCellStyle: {
            maxHeight: '2px',
          },
          lookup: logLevels as Column<{
            level: string;
            message: string;
            created: string;
          }>['lookup'],
          filterComponent: (props) => <CustomLookupFilterParser {...props} />,
          render: (rowData) => {
            return (
              <Typography className={`${getLogLevelStyle(rowData.level)} ${classes.cellContent}`}>
                {rowData.level}
              </Typography>
            );
          },
        },
        {
          title: <Typography>Container</Typography>,
          field: 'container',
          type: 'string',
          align: 'center',
          cellStyle: { padding: '0px', width: '2rem', maxWidth: '2rem' },
          headerStyle: {
            width: '2rem',
            maxWidth: '2rem',
          },
          filterCellStyle: {
            maxHeight: '2px',
          },

          render: (rowData) => {
            return (
              <Typography className={classes.cellContent}>
                {rowData.container ? rowData.container.name : 'Unknown'}
              </Typography>
            );
          },
        },
        {
          title: <Typography>Message</Typography>,
          field: 'message',
          type: 'string',
          cellStyle: { padding: '0px', width: '75rem', minWidth: '75rem', whiteSpace: 'pre-wrap' },
          headerStyle: {
            width: '75rem',
            minWidth: '75rem',
          },
          render: (rowData) => {
            return <Typography className={classes.cellContent}>{rowData.message}</Typography>;
          },
        },
        {
          title: <Typography>Timestamp</Typography>,
          field: 'created',
          type: 'datetime',
          filtering: false,
          align: 'center',
          cellStyle: { padding: '0px' },
          render: (rowData) => {
            return (
              <Typography className={classes.cellContent} data-testid={'log-table-date'}>
                {format(new Date(rowData.created), 'MMM dd yyyy hh:mm aaa')}
              </Typography>
            );
          },
        },
      ]}
      data={rows}
      options={{
        filtering: true,
        search: false,
        pageSize: 100,
        pageSizeOptions: [50, 100, 200],
        maxBodyHeight: tableSize ? tableSize : '80vh',
      }}
      onChangePage={(page, pageSize) => {
        if (addMoreRows) {
          rows.length / pageSize - 1 === page && addMoreRows();
        }
      }}
    />
  );
};
