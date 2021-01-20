import { makeStyles } from '@material-ui/core';
import { Mosaic, MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import './layout-manager.css';
import Debug from 'debug';
import React, { Component } from 'react';

import * as RomiCore from '@osrf/romi-js-core-interfaces';

import { AppControllerContext, ResourcesContext } from '../app-contexts';
import {
  BuildingMapContext,
  DoorStateContext,
  FleetStateContext,
  LiftStateContext,
  NegotiationStatusContext,
  RmfIngressContext,
  TasksContext,
  TransportContext,
} from '../rmf-app';
import { NegotiationTrajectoryResponse } from '../../managers/negotiation-status-manager';

import ScheduleVisualizer, { ScheduleVisualizerProps } from '../schedule-visualizer';
import { RobotRoster, RobotInfo, RobotRosterProps } from 'react-components';
import { DoorList, DoorListProps } from 'react-components';
import { LiftTable, LiftTableProps } from 'react-components';

const debug = Debug('Dashboard');

const useStyles = makeStyles((theme) => ({
  toolBarTitle: {
    flexGrow: 1,
  },
}));

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

export default function LayoutManager(_props: {}): React.ReactElement {
  debug('render');
  const classes = useStyles();
  const appController = React.useContext(AppControllerContext);
  const transport = React.useContext(TransportContext);
  const buildingMap = React.useContext(BuildingMapContext);
  const { trajectoryManager: trajManager } = React.useContext(RmfIngressContext);

  const resourceManager = React.useContext(ResourcesContext);
  const fleetStates = React.useContext(FleetStateContext);
  const fleets = React.useMemo(() => Object.values(fleetStates), [fleetStates]);
  const [negotiationTrajStore, setNegotiationTrajStore] = React.useState<
    Record<string, NegotiationTrajectoryResponse>
  >({});

  const mapFloorSort = React.useCallback(
    (levels: RomiCore.Level[]) =>
      levels.sort((a, b) => a.elevation - b.elevation).map((x) => x.name),
    [],
  );
  const mapFloorLayerSorted = React.useMemo(
    () => (buildingMap ? mapFloorSort(buildingMap.levels) : undefined),
    [buildingMap, mapFloorSort],
  );

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
  function create_tile(id: string, path: MosaicBranch[]): JSX.Element {
    if (id === 'robots') {
      return (
        <MosaicWindow<string>
          path={path}
          className="layout-manager-theme"
          title="Robots"
          toolbarControls={[]}
        >
          <RobotRoster robots={test_robots} />
        </MosaicWindow>
      );
    } else if (id === 'doors') {
      return (
        <MosaicWindow<string>
          path={path}
          className="layout-manager-theme"
          title="Doors"
          toolbarControls={[]}
        >
          <DoorList doors={test_doors} />
        </MosaicWindow>
      );
    } else if (id === 'lifts') {
      return (
        <MosaicWindow<string>
          path={path}
          className="layout-manager-theme"
          title="Lifts"
          toolbarControls={[]}
        >
          <LiftTable lifts={test_lifts} />
        </MosaicWindow>
      );
    } else if (id === 'map_2d') {
      return (
        <MosaicWindow<string>
          path={path}
          className="layout-manager-theme"
          title="Map"
          toolbarControls={[]}
        >
          {buildingMap && (
            <>
              <ScheduleVisualizer
                buildingMap={buildingMap}
                mapFloorSort={mapFloorSort}
                fleets={fleets}
                trajManager={trajManager}
                negotiationTrajStore={negotiationTrajStore}
              ></ScheduleVisualizer>
            </>
          )}
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
