import { MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import { BuildingMapContext } from '../rmf-app';
import ScheduleVisualizer from '../schedule-visualizer';
import { NegotiationTrajectoryResponse } from '../../managers/negotiation-status-manager';

export interface BuildingMapWindowProps extends React.HTMLProps<HTMLDivElement> {
  path: MosaicBranch[];
}

export default function BuildingMapWindow(props: BuildingMapWindowProps): React.ReactElement {
  const buildingMap = React.useContext(BuildingMapContext);

  const [negotiationTrajStore] = React.useState<Record<string, NegotiationTrajectoryResponse>>({});

  const mapFloorSort = React.useCallback(
    (levels: RomiCore.Level[]) =>
      levels.sort((a, b) => a.elevation - b.elevation).map((x) => x.name),
    [],
  );

  return (
    <MosaicWindow<string>
      path={props.path}
      className="layout-manager-theme"
      title="Map"
      toolbarControls={[]}
    >
      {buildingMap && (
        <>
          <ScheduleVisualizer
            buildingMap={buildingMap}
            mapFloorSort={mapFloorSort}
            negotiationTrajStore={negotiationTrajStore}
          ></ScheduleVisualizer>
        </>
      )}
    </MosaicWindow>
  );
}
