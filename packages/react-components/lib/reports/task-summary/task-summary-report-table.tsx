import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { materialTableIcons } from '../../material-table-icons';
import { DefaultLogTableProps } from '../default-report-interface';
import { format } from 'date-fns';
import { returnTaskDetails } from './utils';
import { rosTimeToJs } from '../../utils';
import * as RmfModels from 'rmf-models';

export type TaskSummaryRowsType = {
  created: string; //date
  fleet: { id: number; name: string };
  robot: { id: number; name: string; model?: string };
  task_id: string;
  task_profile: RmfModels.TaskProfile;
  state: string;
  status: string;
  submission_time: RmfModels.Time;
  start_time: RmfModels.Time;
  end_time: RmfModels.Time;
}[];

export interface TaskSummaryReportTable extends DefaultLogTableProps {
  rows: TaskSummaryRowsType | [];
}

export const TaskSummaryReportTable = (props: TaskSummaryReportTable): React.ReactElement => {
  const { rows, tableSize, addMoreRows } = props;

  return (
    <MaterialTable
      title="Task Summary"
      icons={materialTableIcons}
      columns={[
        {
          title: <Typography>Task ID</Typography>,
          field: 'task_id',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.task_id}</Typography>;
          },
        },
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
          title: <Typography>Task Description</Typography>,
          field: 'description',
          type: 'string',
          render: (rowData) => {
            const taskTypeDetails = returnTaskDetails(
              rowData.task_id,
              rowData.task_profile.description,
            );
            return taskTypeDetails;
          },
        },
        {
          title: <Typography>State</Typography>,
          field: 'state',
          type: 'string',
          render: (rowData) => {
            return <Typography>{rowData.state}</Typography>;
          },
        },
        {
          title: <Typography>Time</Typography>,
          field: 'time_information',
          type: 'string',
          render: (rowData) => {
            const submissionTime = rosTimeToJs(
              rowData.task_profile.submission_time,
            ).toLocaleTimeString();
            const startTime = rosTimeToJs(rowData.start_time).toLocaleTimeString();
            const endTime = rosTimeToJs(rowData.end_time).toLocaleTimeString();
            return (
              <>
                <Typography>Submitted: {submissionTime}</Typography>
                <Typography>Start: {startTime}</Typography>
                <Typography>End: {endTime}</Typography>
              </>
            );
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
              <Typography data-testid={'task-table-date'}>
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
