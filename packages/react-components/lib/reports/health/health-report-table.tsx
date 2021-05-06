import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import { materialTableIcons } from '../../material-table-icons';
import { DefaultLogTableProps } from '../default-report-interface';

export type HealthRowsType = {
  created: string; //date
  device: string;
  actor_id: string;
  health_status: string;
  health_message: string;
  payload: string | unknown;
}[];

export interface HealthReportTable extends DefaultLogTableProps {
  rows: HealthRowsType | [];
}

export const HealthReportTable = (props: HealthReportTable): React.ReactElement => {
  const { rows, tableSize, addMoreRows } = props;

  return (
    <MaterialTable
      title="Health"
      icons={materialTableIcons}
      columns={[
        {
          title: <Typography>Device</Typography>,
          field: 'device',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.device}</Typography>;
          },
        },
        {
          title: <Typography>Actor</Typography>,
          field: 'actor_id',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.actor_id}</Typography>;
          },
        },
        {
          title: <Typography>Health Status</Typography>,
          field: 'health_status',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.health_status}</Typography>;
          },
        },
        {
          title: <Typography>Health Message</Typography>,
          field: 'health_message',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.health_message}</Typography>;
          },
        },
        {
          title: <Typography>Timestamp</Typography>,
          field: 'created',
          type: 'datetime',
          filtering: false,
          align: 'center',
          render: (rowData) => {
            return (
              <Typography data-testid={'health-table-date'}>
                {moment(rowData.created).format('lll')}
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
