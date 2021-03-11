import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React, { useMemo } from 'react';
import { RobotMarker as RobotMarker_, RobotMarkerProps } from 'react-components';
import { viewBoxFromLeafletBounds } from '../../util/css-utils';
import { ResourcesContext } from '../app-contexts';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

const debug = Debug('ScheduleVisualizer:RobotsOverlay');
const RobotMarker = React.memo(RobotMarker_);

export interface RobotsOverlayProps extends SVGOverlayProps {
  fleets: readonly RomiCore.FleetState[];
  onRobotClick?(fleet: string, robot: RomiCore.RobotState): void;
  conflictRobotNames: string[][];
  currentFloorName: string;
  MarkerComponent?: React.ComponentType<RobotMarkerProps>;
}

export const RobotsOverlay = (props: RobotsOverlayProps) => {
  debug('render');

  const {
    fleets,
    onRobotClick,
    conflictRobotNames,
    currentFloorName,
    MarkerComponent = RobotMarker,
    ...otherProps
  } = props;
  const robotResourcesContext = React.useContext(ResourcesContext)?.robots;
  const viewBox = viewBoxFromLeafletBounds(props.bounds);
  const footprint = 0.5;

  function inConflict(robotName: string): boolean {
    return conflictRobotNames.flat().includes(robotName) ? true : false;
  }

  // Maps every robot to its fleet. Added the model too in case two robots has the same name on different fleets.
  const fleetContainer = useMemo(() => {
    let robotsFleet: Record<string, string> = {};
    fleets.forEach((fleet) => {
      fleet.robots
        .map((robot) => [robot.name, robot.model])
        .forEach((robotInfo: string[]) => {
          const robotKey = `${robotInfo[0]}_${robotInfo[1]}`;
          robotsFleet[robotKey] = fleet.name;
        });
    });
    return robotsFleet;
  }, [fleets]);

  const robotsInCurLevel = React.useMemo(() => {
    if (!currentFloorName) {
      return [];
    }
    return fleets.flatMap((x) => ({
      fleet: x.name,
      robots: x.robots.filter((r) => r.location.level_name === currentFloorName),
    }));
  }, [fleets, currentFloorName]);

  const handleRobotClick = React.useCallback<Required<RobotMarkerProps>['onClick']>(
    (_, fleetName, robot) => onRobotClick && onRobotClick(fleetName, robot),
    [onRobotClick],
  );

  const getIconPath = React.useCallback(
    (fleet: string, robot: RomiCore.RobotState) => {
      const icon = robotResourcesContext?.getIconPath(fleet, robot.model);
      return icon ? icon : undefined;
    },
    [robotResourcesContext],
  );

  return (
    <SVGOverlay {...otherProps}>
      <svg viewBox={viewBox}>
        {robotsInCurLevel.map(({ fleet, robots }) =>
          robots.map((robot) => (
            <MarkerComponent
              key={robot.name}
              robot={robot}
              fleetName={fleetContainer[`${robot.name}_${robot.model}`]}
              footprint={footprint}
              variant={inConflict(robot.name) ? 'inConflict' : 'normal'}
              iconPath={getIconPath(fleet, robot)}
              onClick={handleRobotClick}
              aria-label={robot.name}
              data-component="RobotMarker"
              data-testid="robotMarker"
            />
          )),
        )}
      </svg>
    </SVGOverlay>
  );
};

export default RobotsOverlay;
