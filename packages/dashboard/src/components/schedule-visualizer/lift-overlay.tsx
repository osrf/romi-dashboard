import * as RmfModels from 'rmf-models';
import Debug from 'debug';
import React, { useContext } from 'react';
import { LiftMarker as LiftMarker_, LiftMarkerProps, useLiftMarkerStyles } from 'react-components';
import { viewBoxFromLeafletBounds } from '../../util/css-utils';
import { LiftStateContext } from '../rmf-app';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

const debug = Debug('ScheduleVisualizer:LiftsOverlay');
const LiftMarker = React.memo(LiftMarker_);

export const getLiftModeVariant = (
  currentFloor: string,
  liftStateMode?: number,
  liftStateFloor?: string,
): keyof ReturnType<typeof useLiftMarkerStyles> | undefined => {
  if (!liftStateMode && !liftStateFloor) return 'unknown';
  if (liftStateMode === RmfModels.LiftState.MODE_FIRE) return 'fire';
  if (liftStateMode === RmfModels.LiftState.MODE_EMERGENCY) return 'emergency';
  if (liftStateMode === RmfModels.LiftState.MODE_OFFLINE) return 'offLine';
  if (liftStateFloor === currentFloor) {
    if (liftStateMode === RmfModels.LiftState.MODE_HUMAN) return 'human';
    if (liftStateMode === RmfModels.LiftState.MODE_AGV) return 'onCurrentFloor';
  } else {
    if (liftStateMode === RmfModels.LiftState.MODE_HUMAN) return 'moving';
    if (liftStateMode === RmfModels.LiftState.MODE_AGV) return 'moving';
  }
  if (liftStateMode === RmfModels.LiftState.MODE_UNKNOWN) return 'unknown';

  return 'unknown';
};

export interface LiftsOverlayProps extends SVGOverlayProps {
  currentFloor: string;
  lifts: readonly RmfModels.Lift[];
  onLiftClick?(lift: RmfModels.Lift): void;
}

export const LiftsOverlay = (props: LiftsOverlayProps) => {
  debug('render');

  const { lifts, onLiftClick, currentFloor, ...otherProps } = props;
  const viewBox = viewBoxFromLeafletBounds(props.bounds);
  const liftsState = useContext(LiftStateContext);

  const handleLiftClick = React.useCallback<Required<LiftMarkerProps>['onClick']>(
    (_, lift) => onLiftClick && onLiftClick(lift),
    [onLiftClick],
  );

  return (
    <>
      <SVGOverlay {...otherProps}>
        <svg viewBox={viewBox}>
          {lifts.map((lift) => (
            <LiftMarker
              key={lift.name}
              id={`Lift-${lift.name}`}
              lift={lift}
              onClick={handleLiftClick}
              liftState={liftsState && liftsState[lift.name]}
              variant={
                liftsState &&
                getLiftModeVariant(
                  currentFloor,
                  liftsState[lift.name]?.current_mode,
                  liftsState[lift.name]?.current_floor,
                )
              }
            />
          ))}
        </svg>
      </SVGOverlay>
    </>
  );
};

export default LiftsOverlay;
