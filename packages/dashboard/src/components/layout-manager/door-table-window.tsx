import { DoorList } from 'react-components';
import { MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';

const test_doors: RomiCore.DoorState[] = [
  {
    door_name: 'door1',
    door_time: { sec: 0, nanosec: 0 },
    current_mode: { value: RomiCore.DoorMode.MODE_CLOSED },
  },
  {
    door_name: 'door2',
    door_time: { sec: 0, nanosec: 0 },
    current_mode: { value: RomiCore.DoorMode.MODE_OPEN },
  },
];

export interface DoorTableWindowProps extends React.HTMLProps<HTMLDivElement> {
  path: MosaicBranch[];
}

export default function DoorTableWindow(props: DoorTableWindowProps): React.ReactElement {
  return (
    <MosaicWindow<string>
      path={props.path}
      className="layout-manager-theme"
      title="Doors"
      toolbarControls={[]}
    >
      <DoorList doors={test_doors} />
    </MosaicWindow>
  );
}
