import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { TableStyles } from './table-styles';

export interface LiftTableProps {
  lifts: RomiCore.LiftState[];
}

function liftModeToString(liftMode: number): string {
  switch (liftMode) {
    case RomiCore.LiftState.MODE_UNKNOWN:
      return 'unknown';
    case RomiCore.LiftState.MODE_HUMAN:
      return 'human';
    case RomiCore.LiftState.MODE_AGV:
      return 'agv';
    default:
      return `unknown mode: (${liftMode})`;
  }
}

export const LiftTable = (props: LiftTableProps) => {
  const classes = TableStyles();
  {
    /*<TableContainer component={Paper}>*/
  }

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow className={classes.tableHeadRow}>
          <TableCell className={classes.tableHeadCell}>Name</TableCell>
          <TableCell className={classes.tableHeadCell}>Mode</TableCell>
          <TableCell className={classes.tableHeadCell}>Current Level</TableCell>
          <TableCell className={classes.tableHeadCell}>Destination</TableCell>
          <TableCell className={classes.tableHeadCell}>Doors</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.lifts.map((lift) => (
          <TableRow key={lift.lift_name}>
            <TableCell>{lift.lift_name}</TableCell>
            <TableCell>{liftModeToString(lift.current_mode)}</TableCell>
            <TableCell>{lift.current_floor}</TableCell>
            <TableCell>{lift.destination_floor}</TableCell>
            <TableCell>{lift.door_state}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  {
    /*</TableContainer>*/
  }
};
