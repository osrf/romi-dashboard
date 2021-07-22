import * as RmfModels from 'rmf-models';

export interface BaseMarkerProps extends Omit<React.SVGAttributes<SVGGElement>, 'onClick'> {
  name: string;
  model: string;
  robotMode: RmfModels.RobotMode;
  x: number;
  y: number;
  yaw: number;
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
  onClick?(event: React.MouseEvent, fleet: string, robot: string): void;
}
