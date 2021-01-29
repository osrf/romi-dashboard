import { Mosaic, MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import Debug from 'debug';
import React from 'react';
import RobotRosterWindow from './robot-roster-window';
import DoorTableWindow from './door-table-window';
import LiftTableWindow from './lift-table-window';
import BuildingMapWindow from './building-map-window';

const debug = Debug('LayoutManager');

export default function LayoutManager(_props: {}): React.ReactElement {
  debug('render');

  function create_tile(id: string, path: MosaicBranch[]): JSX.Element {
    if (id === 'robots') return <RobotRosterWindow path={path} />;
    else if (id === 'doors') return <DoorTableWindow path={path} />;
    else if (id === 'lifts') return <LiftTableWindow path={path} />;
    else if (id === 'map_2d') return <BuildingMapWindow path={path} />;
    else {
      return (
        <MosaicWindow<string>
          path={path}
          className="layout-manager-theme"
          title={id}
          toolbarControls={[]}
        >
          <div>Unknown panel id: {id}</div>
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
          first: 'map_2d',
          second: {
            direction: 'column',
            first: 'robots',
            splitPercentage: 40,
            second: {
              direction: 'column',
              first: 'doors',
              second: 'lifts',
            },
          },
          splitPercentage: 70,
        }}
      />
    </div>
  );
}
