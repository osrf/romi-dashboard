import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { materialTableIcons } from '../../material-table-icons';
import { DefaultLogTableProps } from '../default-report-interface';
import { format } from 'date-fns';

export type FleetStateRowsType = {
  created: string; //date
  fleet: { id: number; name: string };
  robot: { id: number; name: string; model?: string };
  robot_battery_percent: string;
  robot_location: string;
  robot_mode: string;
  robot_seq: number;
  robot_task_id: string;
}[];

export interface FleetStateReportTable extends DefaultLogTableProps {
  rows: FleetStateRowsType | [];
}

export const FleetStateReportTable = (props: FleetStateReportTable): React.ReactElement => {
  const { rows, tableSize, addMoreRows } = props;

  return (
    <MaterialTable
      title="Fleet State"
      icons={materialTableIcons}
      columns={[
        {
          title: <Typography>Fleet</Typography>,
          field: 'fleet_name',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.fleet.name}</Typography>;
          },
        },
        {
          title: <Typography>Robot</Typography>,
          field: 'robot_name',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.robot.name}</Typography>;
          },
        },
        {
          title: <Typography>Battery</Typography>,
          field: 'robot_battery_percent',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.robot_battery_percent}</Typography>;
          },
        },
        {
          title: <Typography>Mode</Typography>,
          field: 'robot_mode',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.robot_mode}</Typography>;
          },
        },
        {
          title: <Typography>Model</Typography>,
          field: 'robot_model',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.robot.model}</Typography>;
          },
        },
        {
          title: <Typography>TaskID</Typography>,
          field: 'robot_task_id',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.robot_task_id}</Typography>;
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
              <Typography data-testid={'fleet-table-date'}>
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
