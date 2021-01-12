//import RGL, { WidthProvider } from 'react-grid-layout';
const ReactGridLayout = require('react-grid-layout');
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import './mega-grid.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

import React, { Component } from 'react';
import { RobotRoster } from './robot-roster';

interface RobotInfoProps {
  fleetName: string;
  robot: RomiCore.RobotState;
}

const test_robots: Array<RobotInfoProps> = Array(
  {
    fleetName: 'fleet1',
    robot: {
      name: 'robot1',
      battery_percent: 42.1,
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      model: 'model1',
      task_id: 'task1',
      path: [],
    },
  },
  {
    fleetName: 'fleet1',
    robot: {
      name: 'robot2',
      battery_percent: 45,
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      model: 'model2',
      task_id: 'task2',
      path: [],
    },
  },
);

export class MegaGrid extends React.Component {
  render() {
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
      { i: 'b', x: 1, y: 1, w: 3, h: 2, minW: 2, maxW: 5 },
      { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ];
    return (
      <div className="container">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          compactType={null}
          measureBeforeMount
        >
          <div key="a">
            <span className="text">A is not draggable</span>
          </div>
          <div key="b">
            <RobotRoster robots={test_robots} />
          </div>
          <div key="c">
            <span className="text">C is draggable and resizable</span>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}
