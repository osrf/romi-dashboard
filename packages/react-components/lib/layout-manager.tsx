import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import './layout-manager.css';
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

export class LayoutManager extends React.Component {
  render() {
    /*
    const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
      a: <MosaicWindow<string>
         >
           <div>Left Window</div>
         </MosaicWindow>,
      b: <div>Top Right Window</div>,
      c: <div>Bottom Right Window</div>,
    };
    */
    function create_tile(id: string, path: string): JSX.Element {
      if (id === 'b') {
        return (
          <MosaicWindow<string>
            path={path}
            className="layout-manager-theme"
            title="Robot Roster"
            toolbarControls={[]}
          >
            <RobotRoster robots={test_robots} />
          </MosaicWindow>
        );
      } else {
        return (
          <MosaicWindow<string>
            path={path}
            className="layout-manager-theme"
            title={id}
            toolbarControls={[]}
          >
            <div>Hello this is the content of panel {id}</div>
          </MosaicWindow>
        );
      }
    }

    return (
      <div id="layout_manager">
        <Mosaic<string>
          renderTile={(id, path) => create_tile(id, path)}
          resize={{ minimumPaneSizePercentage: 5 }}
          initialValue={{
            direction: 'row',
            first: 'a',
            second: {
              direction: 'column',
              first: 'b',
              second: 'c',
            },
            splitPercentage: 40,
          }}
        />
      </div>
    );
  }
}
