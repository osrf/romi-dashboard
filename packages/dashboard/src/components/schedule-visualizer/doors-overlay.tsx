import Debug from 'debug';
import React from 'react';
import { DoorMarker as DoorMarker_, DoorMarkerProps } from 'react-components';
import * as RmfModels from 'rmf-models';
import { viewBoxFromLeafletBounds } from '../../util/css-utils';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

const debug = Debug('ScheduleVisualizer:DoorsOverlay');
const DoorMarker = React.memo(DoorMarker_);

export interface DoorsOverlayProps extends SVGOverlayProps {
  doors: RmfModels.Door[];
  doorStates?: Record<string, RmfModels.DoorState>;
  onDoorClick?(door: RmfModels.Door): void;
}

export const DoorsOverlay = (props: DoorsOverlayProps) => {
  debug('render');

  const { doors, doorStates = {}, onDoorClick, ...otherProps } = props;
  const viewBox = viewBoxFromLeafletBounds(props.bounds);

  const handleDoorClick = React.useCallback<Required<DoorMarkerProps>['onClick']>(
    (_, door) => onDoorClick && onDoorClick(door),
    [onDoorClick],
  );

  return (
    <SVGOverlay {...otherProps}>
      <svg viewBox={viewBox}>
        {doors.map((door) => (
          <DoorMarker
            key={door.name}
            onClick={handleDoorClick}
            door={door}
            doorMode={
              doorStates && doorStates[door.name] && doorStates[door.name].current_mode.value
            }
            aria-label={door.name}
            data-component="DoorMarker"
            data-testid="doorMarker"
          />
        ))}
      </svg>
    </SVGOverlay>
  );
};

export default DoorsOverlay;
