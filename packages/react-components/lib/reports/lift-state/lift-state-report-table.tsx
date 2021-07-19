import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { materialTableIcons } from '../../material-table-icons';
import { DefaultLogTableProps } from '../default-report-interface';
import { format } from 'date-fns';

export type LiftStateRowsType = {
  created: string; //date
  state: string;
  lift?: { id: number; name: string };
  door_state: string;
  destination_floor: string;
  motion_state: string;
  current_floor: string;
  session_id: string;
}[];

export interface LiftStateReportTable extends DefaultLogTableProps {
  rows: LiftStateRowsType | [];
}

export const LiftStateReportTable = (props: LiftStateReportTable): React.ReactElement => {
  const { rows, tableSize, addMoreRows } = props;

  return (
    <MaterialTable
      title="Lift State"
      icons={materialTableIcons}
      columns={[
        {
          title: <Typography>Session ID</Typography>,
          field: 'level',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.session_id}</Typography>;
          },
        },
        {
          title: <Typography>State</Typography>,
          field: 'message',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.state}</Typography>;
          },
        },
        {
          title: <Typography>Door State</Typography>,
          field: 'message',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.door_state}</Typography>;
          },
        },
        {
          title: <Typography>Destination Floor</Typography>,
          field: 'message',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.destination_floor}</Typography>;
          },
        },
        {
          title: <Typography>Motion State</Typography>,
          field: 'message',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.motion_state}</Typography>;
          },
        },
        {
          title: <Typography>Current Floor</Typography>,
          field: 'message',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.current_floor}</Typography>;
          },
        },

        {
          title: <Typography>Timestamp</Typography>,
          field: 'timestamp',
          type: 'datetime',
          filtering: false,
          align: 'center',
          render: (rowData) => {
            return (
              <Typography data-testid={'lift-table-date'}>
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
