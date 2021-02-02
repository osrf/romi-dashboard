import { DoorList } from 'react-components';
import { MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';

const doors = [];

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
      <DoorList doors={doors} />
    </MosaicWindow>
  );
}
