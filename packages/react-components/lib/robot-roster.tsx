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

function robotModeToString(robotMode: RomiCore.RobotMode): string {
  switch (robotMode.mode) {
    case RomiCore.RobotMode.MODE_CHARGING:
      return 'Charging';
    case RomiCore.RobotMode.MODE_DOCKING:
      return 'Docking';
    case RomiCore.RobotMode.MODE_EMERGENCY:
      return 'Emergency';
    case RomiCore.RobotMode.MODE_GOING_HOME:
      return 'Going Home';
    case RomiCore.RobotMode.MODE_IDLE:
      return 'Idle';
    case RomiCore.RobotMode.MODE_MOVING:
      return 'Moving';
    case RomiCore.RobotMode.MODE_PAUSED:
      return 'Paused';
    case RomiCore.RobotMode.MODE_WAITING:
      return 'Waiting';
    default:
      return `Unknown (${robotMode.mode})`;
  }
}

export interface RobotInfo {
  fleetName: string;
  robot: RomiCore.RobotState;
}

export interface RobotRosterProps extends React.HTMLProps<HTMLDivElement> {
  robots: RobotInfo[];
}

export const RobotRoster = (props: RobotRosterProps): JSX.Element => {
  const classes = TableStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.tableHeadCell}>Fleet</TableCell>
            <TableCell className={classes.tableHeadCell}>Name</TableCell>
            <TableCell className={classes.tableHeadCell}>Model</TableCell>
            <TableCell className={classes.tableHeadCell}>Mode</TableCell>
            <TableCell className={classes.tableHeadCell}>Battery</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.robots.map((info) => (
            <TableRow key={info.robot.name}>
              <TableCell>{info.fleetName}</TableCell>
              <TableCell>{info.robot.name}</TableCell>
              <TableCell>{info.robot.model}</TableCell>
              <TableCell>{robotModeToString(info.robot.mode)}</TableCell>
              <TableCell>{info.robot.battery_percent.toFixed(0)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
