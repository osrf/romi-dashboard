import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { TableStyles } from './table-styles';

export interface DoorTableProps extends React.HTMLProps<HTMLDivElement> {
  doors: RomiCore.DoorState[];
}

function doorModeToString(doorMode: RomiCore.DoorMode): string {
  switch (doorMode.value) {
    case RomiCore.DoorMode.MODE_CLOSED:
      return 'closed';
    case RomiCore.DoorMode.MODE_OPEN:
      return 'open';
    case RomiCore.DoorMode.MODE_MOVING:
      return 'moving';
    default:
      return `unknown mode: (${doorMode.value})`;
  }
}

export const DoorTable = (props: DoorTableProps): JSX.Element => {
  const classes = TableStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.tableHeadCell}>Name</TableCell>
            <TableCell className={classes.tableHeadCell}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.doors.map((door) => (
            <TableRow key={door.door_name}>
              <TableCell>{door.door_name}</TableCell>
              <TableCell>{doorModeToString(door.current_mode)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
