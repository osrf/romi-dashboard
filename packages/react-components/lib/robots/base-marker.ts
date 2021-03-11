import * as RomiCore from '@osrf/romi-js-core-interfaces';

export interface BaseMarkerProps extends Omit<React.SVGAttributes<SVGGElement>, 'onClick'> {
  robot: RomiCore.RobotState;
  footprint: number;
  fleetName: string;
  /**
   * Whether the component should perform a translate transform to put it inline with the position
   * in RMF.
   *
   * default: true
   */
  translate?: boolean;
  variant?: 'normal' | 'inConflict';
  onClick?(event: React.MouseEvent, fleet: string, robot: RomiCore.RobotState): void;
}
