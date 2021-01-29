import { RobotRoster, RobotInfo } from 'react-components';
import { MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';

const test_robots: RobotInfo[] = [
  {
    fleetName: 'fleet1',
    robot: {
      name: 'robot1',
      model: 'model1',
      task_id: 'task1',
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      battery_percent: 42.1,
      location: { t: { sec: 0, nanosec: 0 }, x: 1, y: 2, yaw: 3, level_name: 'L1' },
      path: [],
    },
  },
  {
    fleetName: 'fleet1',
    robot: {
      name: 'robot2',
      model: 'model1',
      task_id: 'task2',
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      battery_percent: 43.0,
      location: { t: { sec: 0, nanosec: 0 }, x: 1, y: 2, yaw: 3, level_name: 'L1' },
      path: [],
    },
  },
  {
    fleetName: 'fleet2',
    robot: {
      name: 'robot3',
      model: 'model2',
      task_id: 'task3',
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      battery_percent: 44.0,
      location: { t: { sec: 0, nanosec: 0 }, x: 1, y: 2, yaw: 3, level_name: 'L1' },
      path: [],
    },
  },
];

export interface RobotRosterWindowProps extends React.HTMLProps<HTMLDivElement> {
  path: MosaicBranch[];
}

export default function RobotRosterWindow(props: RobotRosterWindowProps): React.ReactElement {
  return (
    <MosaicWindow<string>
      path={props.path}
      className="layout-manager-theme"
      title="Robots"
      toolbarControls={[]}
    >
      <RobotRoster robots={test_robots} />
    </MosaicWindow>
  );
}
