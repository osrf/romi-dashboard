import { RobotTable, RobotInfo } from 'react-components';
import { MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';

export interface RobotTableWindowProps extends React.HTMLProps<HTMLDivElement> {
  path: MosaicBranch[];
}

const robots: RobotInfo[] = [];

export default function RobotTableWindow(props: RobotTableWindowProps): React.ReactElement {
  return (
    <MosaicWindow<string>
      path={props.path}
      className="layout-manager-theme"
      title="Robots"
      toolbarControls={[]}
    >
      <RobotTable robots={robots} />
    </MosaicWindow>
  );
}
