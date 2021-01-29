import { LiftTable } from 'react-components';
import { MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';

const test_lifts: RomiCore.LiftState[] = [
  {
    lift_time: { sec: 0, nanosec: 0 },
    lift_name: 'lift42',
    available_floors: [],
    current_floor: 'L1',
    destination_floor: 'L4',
    door_state: RomiCore.LiftState.DOOR_CLOSED,
    motion_state: RomiCore.LiftState.MOTION_UP,
    available_modes: new Uint8Array(),
    current_mode: RomiCore.LiftState.MODE_AGV,
    session_id: '',
  },
  {
    lift_time: { sec: 0, nanosec: 0 },
    lift_name: 'lift43',
    available_floors: [],
    current_floor: 'B1',
    destination_floor: 'L3',
    door_state: RomiCore.LiftState.DOOR_CLOSED,
    motion_state: RomiCore.LiftState.MOTION_UP,
    available_modes: new Uint8Array(),
    current_mode: RomiCore.LiftState.MODE_AGV,
    session_id: '',
  },
];

export interface LiftTableWindowProps extends React.HTMLProps<HTMLDivElement> {
  path: MosaicBranch[];
}

export default function LiftTableWindow(props: LiftTableWindowProps): React.ReactElement {
  return (
    <MosaicWindow<string>
      path={props.path}
      className="layout-manager-theme"
      title="Lifts"
      toolbarControls={[]}
    >
      <LiftTable lifts={test_lifts} />
    </MosaicWindow>
  );
}
