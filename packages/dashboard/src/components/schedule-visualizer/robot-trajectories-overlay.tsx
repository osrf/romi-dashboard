import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import * as L from 'leaflet';
import React from 'react';
import {
  ColorContext,
  robotHash,
  TrajectoryMarker as TrajectoryMarker_,
  TrajectoryMarkerProps,
} from 'react-components';
import { Conflict, Trajectory } from '../../managers/robot-trajectory-manager';
import { TrajectoryAnimation } from '../../settings';
import { SettingsContext } from '../app-contexts';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

const debug = Debug('ScheduleVisualizer:RobotTrajectoriesOverlay');
const TrajectoryMarker = React.memo(TrajectoryMarker_);

export interface RobotTrajectoriesOverlayProps extends SVGOverlayProps {
  /**
   * Must be a record of hashes with key from `robotHash` function.
   *
   * Remarks: `Trajectory` is missing robot model so we need to join it with the robot data.
   */
  robots: Record<string, RomiCore.RobotState>;
  trajectories: Trajectory[];
  conflicts: Conflict[];
  animationScale?: number;
}

/**
 * Contexts: ColorContext
 */
export const RobotTrajectoriesOverlay = (props: RobotTrajectoriesOverlayProps) => {
  debug('render');

  const { robots, trajectories, conflicts, animationScale = 60000 / 1800, ...otherProps } = props;
  const colorManager = React.useContext(ColorContext);
  const [colors, setColors] = React.useState<Record<number, string>>({});

  const conflictsFlat = React.useMemo(() => conflicts.flat(), [conflicts]);

  const bounds =
    props.bounds instanceof L.LatLngBounds ? props.bounds : new L.LatLngBounds(props.bounds);
  const width = bounds.getEast() - bounds.getWest();
  const height = bounds.getNorth() - bounds.getSouth();
  const viewBox = `0 0 ${width} ${height}`;

  React.useEffect(() => {
    (async () => {
      const newColors: Record<string, string> = {};
      await Promise.all(
        trajectories.map(async (traj) => {
          const key = robotHash(traj.robot_name, traj.fleet_name);
          const robot = robots[key];
          if (!robot) {
            console.error(`trajectory "${traj.id}" belongs to unknown robot`);
            return;
          }
          newColors[traj.id] = await colorManager.robotPrimaryColor(
            traj.fleet_name,
            robot.name,
            robot.model,
          );
        }),
      );
      setColors(newColors);
    })();
  }, [trajectories, colorManager, robots]);

  const settings = React.useContext(SettingsContext);
  const trajectoryVariant = ((): TrajectoryMarkerProps['variant'] => {
    switch (settings.trajectoryAnimation) {
      case TrajectoryAnimation.Follow:
        return 'follow';
      case TrajectoryAnimation.None:
        return 'plain';
      default:
        return 'plain';
    }
  })();

  return (
    <SVGOverlay {...otherProps}>
      <svg viewBox={viewBox}>
        {trajectories.map(
          (traj) =>
            colors[traj.id] && (
              <TrajectoryMarker
                key={traj.id}
                trajectory={traj}
                color={colors[traj.id]}
                conflict={conflictsFlat.includes(traj.id)}
                animationScale={animationScale}
                variant={trajectoryVariant}
                data-component="TrajectoryMarker"
                data-testid="trajMarker"
              />
            ),
        )}
      </svg>
    </SVGOverlay>
  );
};

export default RobotTrajectoriesOverlay;
