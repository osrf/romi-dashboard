import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React, { useMemo } from 'react';
import { WaypointMarker as WaypointMarker_ } from 'react-components';
import { viewBoxFromLeafletBounds } from '../../util/css-utils';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

const debug = Debug('ScheduleVisualier:WaypointsOverlay');
const WaypointMarker = React.memo(WaypointMarker_);

export interface WaypointsOverlayProps extends SVGOverlayProps {
  currentLevel: RomiCore.Level;
}

export const WaypointsOverlay = (props: WaypointsOverlayProps) => {
  debug('render');

  const { currentLevel, ...otherProps } = props;
  const viewBox = viewBoxFromLeafletBounds(props.bounds);
  // Set the size of the waypoint. At least for now we don't want for this to change. We left this here in case we want for this to change in the future.
  const size = 0.1;
  const waypoints = useMemo(() => {
    if (currentLevel.nav_graphs.length === 0) {
      return [];
    }
    return currentLevel.nav_graphs[0].vertices;
  }, [currentLevel]);

  return (
    <SVGOverlay {...otherProps}>
      <svg viewBox={viewBox}>
        {waypoints.map(
          (waypoint) =>
            !!waypoint.name && (
              <WaypointMarker
                key={waypoint.name}
                waypoint={waypoint}
                size={size}
                data-testid="waypointMarker"
              />
            ),
        )}
      </svg>
    </SVGOverlay>
  );
};

export default WaypointsOverlay;
