import { makeStyles } from '@material-ui/core';
import Debug from 'debug';
import * as L from 'leaflet';
import React from 'react';
import { ColorContext, robotHash } from 'react-components';
import { AttributionControl, ImageOverlay, LayersControl, Map as LMap, Pane } from 'react-leaflet';
import * as RmfModels from 'rmf-models';
import { NegotiationTrajectoryResponse } from '../../managers/negotiation-status-manager';
import {
  Conflict,
  DefaultTrajectoryManager,
  Trajectory,
  TrajectoryResponse,
} from '../../managers/robot-trajectory-manager';
import { AppConfigContext } from '../app-contexts';
import { FleetStateContext, RmfIngressContext } from '../rmf-app';
import DispensersOverlay from './dispensers-overlay';
import DoorsOverlay from './doors-overlay';
import LiftsOverlay from './lift-overlay';
import { NegotiationColors } from './negotiation-colors';
import RobotTrajectoriesOverlay from './robot-trajectories-overlay';
import RobotsOverlay, { RobotsOverlayProps } from './robots-overlay';
import WaypointsOverlay from './waypoints-overlay';

const debug = Debug('ScheduleVisualizer');

const useStyles = makeStyles(() => ({
  map: {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
}));

export interface MapFloorLayer {
  level: RmfModels.Level;
  imageUrl: string;
  bounds: L.LatLngBounds;
}

export interface ScheduleVisualizerProps extends React.PropsWithChildren<{}> {
  buildingMap: RmfModels.BuildingMap;
  negotiationTrajStore: Readonly<Record<string, NegotiationTrajectoryResponse>>;
  showTrajectories?: boolean;
  mapFloorSort?(levels: RmfModels.Level[]): string[];
  onDoorClick?(door: RmfModels.Door): void;
  onLiftClick?(lift: RmfModels.Lift): void;
  onRobotClick?: RobotsOverlayProps['onRobotClick'];
  onDispenserClick?(event: React.MouseEvent, guid: string): void;
}

export function calcMaxBounds(
  mapFloorLayers: readonly MapFloorLayer[],
): L.LatLngBounds | undefined {
  if (!mapFloorLayers.length) {
    return undefined;
  }
  const bounds = new L.LatLngBounds([0, 0], [0, 0]);
  Object.values(mapFloorLayers).forEach((x) => bounds.extend(x.bounds));
  return bounds.pad(0.2);
}

export let windowMap = new window.Map();

export default function ScheduleVisualizer(props: ScheduleVisualizerProps): React.ReactElement {
  debug('render');
  const { buildingMap, negotiationTrajStore, mapFloorSort, showTrajectories } = props;
  const negotiationColors = React.useMemo(() => new NegotiationColors(), []);

  const authenticator = React.useContext(AppConfigContext).authenticator;

  const mapFloorLayerSorted = React.useMemo(
    () =>
      mapFloorSort
        ? mapFloorSort(buildingMap.levels)
        : buildingMap.levels.map((level) => level.name),
    [mapFloorSort, buildingMap.levels],
  );

  const classes = useStyles();

  const [mapFloorLayers, setMapFloorLayers] = React.useState<
    Readonly<Record<string, MapFloorLayer>>
  >({});
  const [curLevelName, setCurLevelName] = React.useState(() => mapFloorLayerSorted[0]);
  const curMapFloorLayer = React.useMemo(() => mapFloorLayers[curLevelName], [
    curLevelName,
    mapFloorLayers,
  ]);

  const [trajectories, setTrajectories] = React.useState<Record<string, TrajectoryResponse>>({});
  const [conflictRobotNames, setConflictRobotNames] = React.useState<string[][]>(() => []);
  const [curMapTrajectories, setCurMapTrajectories] = React.useState<Trajectory[]>(() => []);
  const [curMapConflicts, setCurMapConflicts] = React.useState<Conflict[]>(() => []);

  const initialBounds = React.useMemo<Readonly<L.LatLngBounds> | undefined>(() => {
    const initialLayer = mapFloorLayers[mapFloorLayerSorted[0]];
    if (!initialLayer) {
      return undefined;
    }

    return initialLayer.bounds;
  }, [mapFloorLayers, mapFloorLayerSorted]);
  const [maxBounds, setMaxBounds] = React.useState<Readonly<L.LatLngBounds> | undefined>(() =>
    calcMaxBounds(Object.values(mapFloorLayers)),
  );
  const [bound, setBound] = React.useState(initialBounds);

  const fleetStates = React.useContext(FleetStateContext);
  const fleets = React.useMemo(() => Object.values(fleetStates), [fleetStates]);

  const { trajectoryManager: trajManager } = React.useContext(RmfIngressContext) || {};

  const robots = React.useMemo(
    () =>
      fleets.reduce<Record<string, RmfModels.RobotState>>((prev, fleet) => {
        fleet.robots.forEach((robot) => {
          prev[robotHash(robot.name, fleet.name)] = robot;
        });
        return prev;
      }, {}),
    [fleets],
  );

  const trajLookahead = 600000; // 10 min
  const trajAnimDuration = 2000;

  React.useEffect(() => {
    // We need the image to be loaded to know the bounds, but the image cannot be loaded without a
    // bounds, it is possible to use a temporary bounds but that would cause the viewport to move
    // when we replace the temporary bounds. A solution is to load the image in a temporary HTML
    // image element, then load the ImageOverlay in leaflet, the downside is that the image gets
    // loaded twice.
    (async () => {
      const promises: Promise<any>[] = [];
      const mapFloorLayers: Record<string, MapFloorLayer> = {};
      for (const level of props.buildingMap.levels) {
        const image = level.images[0]; // when will there be > 1 image?
        if (!image) {
          continue;
        }

        promises.push(
          new Promise<void>((res) => {
            const imageElement = new Image();
            const imageUrl = image.data;
            imageElement.src = imageUrl;

            const listener = () => {
              imageElement.removeEventListener('load', listener);
              const width = imageElement.naturalWidth * image.scale;
              const height = imageElement.naturalHeight * image.scale;
              // TODO: support both svg and image
              // const svgElement = rawCompressedSVGToSVGSVGElement(image.data);
              // const height = (svgElement.height.baseVal.value * scale) / IMAGE_SCALE;
              // const width = (svgElement.width.baseVal.value * scale) / IMAGE_SCALE;

              const bounds = new L.LatLngBounds(
                [image.y_offset - height, image.x_offset],
                [image.y_offset, image.x_offset + width],
              );

              mapFloorLayers[level.name] = {
                level: level,
                imageUrl: imageUrl,
                bounds: bounds,
              };
              res();
            };
            imageElement.addEventListener('load', listener);
          }),
        );
      }

      for (const p of promises) {
        await p;
      }
      debug('set map floor layers');
      setMapFloorLayers(mapFloorLayers);
      debug('set max bounds');
      setMaxBounds(calcMaxBounds(Object.values(mapFloorLayers)));
    })();
  }, [props.buildingMap]);

  React.useEffect(() => {
    let interval: number;
    let cancel = false;

    const updateTrajectory = async () => {
      debug('updating trajectories');

      if (cancel || !curMapFloorLayer || !trajManager) {
        return;
      }

      const resp = await trajManager.latestTrajectory({
        request: 'trajectory',
        param: {
          map_name: curMapFloorLayer.level.name,
          duration: trajLookahead,
          trim: true,
        },
        token: authenticator.token,
      });

      debug('set trajectories');
      if (showTrajectories === undefined || showTrajectories) {
        setTrajectories((prev) => ({
          ...prev,
          [curMapFloorLayer.level.name]: resp,
        }));
      } else {
        setTrajectories({});
      }
    };

    updateTrajectory();
    interval = window.setInterval(updateTrajectory, trajAnimDuration);
    debug(`created trajectory update interval ${interval}`);

    return () => {
      cancel = true;
      clearInterval(interval);
      debug(`cleared interval ${interval}`);
    };
  }, [trajManager, curMapFloorLayer, trajAnimDuration, showTrajectories, authenticator.token]);

  function handleBaseLayerChange(e: L.LayersControlEvent): void {
    debug('set current level name');
    setCurLevelName(e.name);
    setBound(mapFloorLayers[e.name].bounds);
  }

  function getConflicts(levelName: string): Conflict[] {
    const resp = trajectories[levelName];
    return resp ? resp.conflicts : [];
  }

  const sortedMapFloorLayers = mapFloorLayerSorted.map((x) => mapFloorLayers[x]);
  const ref = React.useRef<ImageOverlay>(null);
  const mapRef = React.useRef<LMap>(null);

  if (ref.current) {
    ref.current.leafletElement.setZIndex(0);
    if (mapRef.current && !windowMap.get('lmap')) {
      windowMap.set('lmap', mapRef);
    }
  }

  React.useEffect(() => {
    function getTrajectory(levelName: string): Trajectory[] {
      const resp = trajectories[levelName];
      return resp ? resp.values : [];
    }

    function getConflicts(levelName: string): Conflict[] {
      const resp = trajectories[levelName];
      return resp ? resp.conflicts : [];
    }

    function getConflictRobotsName(conflicts: Conflict[], trajs: Trajectory[]): string[][] {
      let conflictRobotNames: string[][] = [];
      if (conflicts.length === 0) {
        return [];
      }
      conflicts.forEach((conflictPair) => {
        let robotNames: string[] = [];
        conflictPair.forEach((conflictId) => {
          const robotName = DefaultTrajectoryManager.getRobotNameFromPathId(conflictId, trajs);
          robotName && robotNames.push(robotName);
        });
        robotNames && conflictRobotNames.push(robotNames);
      });
      return conflictRobotNames;
    }

    if (curMapFloorLayer) {
      const mapTrajectories = getTrajectory(curMapFloorLayer.level.name);
      const mapConflicts = getConflicts(curMapFloorLayer.level.name);
      debug('set current map trajectories');
      setCurMapTrajectories(mapTrajectories);
      debug('set current map conflicts');
      setCurMapConflicts(mapConflicts);
      debug('set conflicting robots');
      setConflictRobotNames(getConflictRobotsName(mapConflicts, mapTrajectories));
    }
  }, [curMapFloorLayer, trajectories]);

  const negoTrajs = negotiationTrajStore[curLevelName]
    ? negotiationTrajStore[curLevelName].values
    : [];

  return (
    <LMap
      id="ScheduleVisualizer" // # data-* attrs are not set on the leaflet container
      className={classes.map}
      attributionControl={false}
      crs={L.CRS.Simple}
      minZoom={0}
      maxZoom={8}
      zoomDelta={0.5}
      zoomSnap={0.5}
      bounds={bound ? bound : initialBounds}
      maxBounds={maxBounds}
      onbaselayerchange={handleBaseLayerChange}
      ref={mapRef}
    >
      <AttributionControl position="bottomright" prefix="OSRC-SG" />
      <LayersControl position="topleft">
        {sortedMapFloorLayers.every((x) => x) &&
          sortedMapFloorLayers.map((floorLayer, i) => (
            <LayersControl.BaseLayer
              checked={i === 0}
              name={floorLayer.level.name}
              key={floorLayer.level.name}
            >
              <ImageOverlay bounds={floorLayer.bounds} url={floorLayer.imageUrl} ref={ref} />
            </LayersControl.BaseLayer>
          ))}

        <LayersControl.Overlay name="Robot Trajectories" checked>
          {curMapFloorLayer && (
            <Pane>
              <RobotTrajectoriesOverlay
                bounds={curMapFloorLayer.bounds}
                robots={robots}
                trajectories={curMapTrajectories}
                conflicts={curMapConflicts}
              />
            </Pane>
          )}
        </LayersControl.Overlay>

        {curMapFloorLayer && (
          <Pane>
            <ColorContext.Provider value={negotiationColors}>
              <RobotTrajectoriesOverlay
                bounds={curMapFloorLayer.bounds}
                robots={robots}
                trajectories={negoTrajs}
                conflicts={getConflicts(curLevelName)}
              />
            </ColorContext.Provider>
          </Pane>
        )}

        <LayersControl.Overlay name="Doors" checked>
          {curMapFloorLayer && (
            <Pane>
              <DoorsOverlay
                bounds={curMapFloorLayer.bounds}
                doors={curMapFloorLayer.level.doors}
                onDoorClick={props.onDoorClick}
              />
            </Pane>
          )}
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Lifts" checked>
          {curMapFloorLayer && (
            <Pane>
              <LiftsOverlay
                bounds={curMapFloorLayer.bounds}
                currentFloor={curLevelName}
                lifts={props.buildingMap.lifts}
                onLiftClick={props.onLiftClick}
              />
            </Pane>
          )}
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Robots" checked>
          {curMapFloorLayer && (
            <Pane>
              <RobotsOverlay
                currentFloorName={curLevelName}
                bounds={curMapFloorLayer.bounds}
                fleets={fleets}
                onRobotClick={props.onRobotClick}
                conflictRobotNames={conflictRobotNames}
              />
            </Pane>
          )}
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Waypoints" checked>
          {curMapFloorLayer && (
            <Pane>
              <WaypointsOverlay
                bounds={curMapFloorLayer.bounds}
                currentLevel={curMapFloorLayer.level}
              />
            </Pane>
          )}
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Dispensers" checked>
          {curMapFloorLayer && (
            <Pane>
              <DispensersOverlay
                currentFloorName={curLevelName}
                bounds={curMapFloorLayer.bounds}
                onDispenserClick={props.onDispenserClick}
              />
            </Pane>
          )}
        </LayersControl.Overlay>
      </LayersControl>
      {props.children}
    </LMap>
  );
}
