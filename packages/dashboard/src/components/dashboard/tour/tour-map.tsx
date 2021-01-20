import { makeStyles } from '@material-ui/core';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import * as L from 'leaflet';
import React from 'react';
import { AttributionControl, ImageOverlay, LayersControl, Map as LMap, Pane } from 'react-leaflet';
import { toBlobUrl } from '../../../util';
import DispensersOverlay from '../../schedule-visualizer/dispensers-overlay';
import DoorsOverlay from '../../schedule-visualizer/doors-overlay';
import { calcMaxBounds, MapFloorLayer } from '../../schedule-visualizer/index';
import LiftsOverlay from '../../schedule-visualizer/lift-overlay';
import RobotsOverlay from '../../schedule-visualizer/robots-overlay';
import WaypointsOverlay from '../../schedule-visualizer/waypoints-overlay';

const debug = Debug('TourMap');

const useStyles = makeStyles(() => ({
  map: {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
}));

export interface TourMapProps {
  buildingMap: Readonly<RomiCore.BuildingMap>;
  fleets: Readonly<RomiCore.FleetState[]>;
  mapFloorLayerSorted: Readonly<string[]>;
}

export default function TourMap(props: TourMapProps): React.ReactElement {
  debug('render');
  const { mapFloorLayerSorted } = props;
  const classes = useStyles();

  const [mapFloorLayers, setMapFloorLayers] = React.useState<
    Readonly<Record<string, MapFloorLayer>>
  >({});
  const [curLevelName, setCurLevelName] = React.useState(() => mapFloorLayerSorted[0]);
  const initialBounds = React.useMemo<Readonly<L.LatLngBounds> | undefined>(() => {
    const initialLayer = mapFloorLayers[mapFloorLayerSorted[0]];
    if (!initialLayer) {
      return undefined;
    }

    return initialLayer.bounds;
  }, [mapFloorLayers, mapFloorLayerSorted]);
  const [bound, setBound] = React.useState(initialBounds);

  const sortedMapFloorLayers = mapFloorLayerSorted.map((x) => mapFloorLayers[x]);
  const ref = React.useRef<ImageOverlay>(null);
  const mapRef = React.useRef<LMap>(null);

  if (ref.current) {
    ref.current.leafletElement.setZIndex(0);
  }

  const [maxBounds, setMaxBounds] = React.useState<Readonly<L.LatLngBounds> | undefined>(() =>
    calcMaxBounds(Object.values(mapFloorLayers)),
  );

  const curMapFloorLayer = React.useMemo(() => mapFloorLayers[curLevelName], [
    curLevelName,
    mapFloorLayers,
  ]);
  const conflictRobotNames: string[][] = [];

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
          new Promise((res) => {
            const imageElement = new Image();
            const imageUrl = toBlobUrl(image.data);
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

  function handleBaseLayerChange(e: L.LayersControlEvent): void {
    debug('set current level name');
    setCurLevelName(e.name);
    setBound(mapFloorLayers[e.name].bounds);
  }

  return (
    <LMap
      id="TourMap"
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
        <LayersControl.Overlay name="Doors" checked>
          {curMapFloorLayer && (
            <Pane>
              <DoorsOverlay bounds={curMapFloorLayer.bounds} doors={curMapFloorLayer.level.doors} />
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
                fleets={props.fleets}
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
              <DispensersOverlay currentFloorName={curLevelName} bounds={curMapFloorLayer.bounds} />
            </Pane>
          )}
        </LayersControl.Overlay>
      </LayersControl>
    </LMap>
  );
}
