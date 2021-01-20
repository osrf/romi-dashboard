import Debug from 'debug';
import React from 'react';
import { DispenserMarker as DispenserMarker_ } from 'react-components';
import { DispenserResource } from '../../managers/resource-manager-dispensers';
import { viewBoxFromLeafletBounds } from '../../util/css-utils';
import { ResourcesContext } from '../app-contexts';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

const debug = Debug('ScheduleVisualizer:DispensersOverlay');
const DispenserMarker = React.memo(DispenserMarker_);

export interface DispensersOverlayProps extends SVGOverlayProps {
  currentFloorName: string;
  onDispenserClick?(event: React.MouseEvent, guid: string): void;
}

export const DispensersOverlay = (props: DispensersOverlayProps): React.ReactElement => {
  debug('render');

  const { currentFloorName, onDispenserClick, ...otherProps } = props;
  const viewBox = viewBoxFromLeafletBounds(props.bounds);
  const footprint = 0.4;
  const dispenserResourcesContext = React.useContext(ResourcesContext)?.dispensers;

  /**
   * We choose to iterate the dispensers inside resources because we get the positions
   * from the resources file and not from the dispenser's state. In case the dispenser
   * doesn't have an entry in the resources file it will not appear in the map, but
   * still will appear in the Omnipanel.
   */
  const dispenserInCurLevel = React.useMemo(() => {
    if (!dispenserResourcesContext) {
      return [];
    }
    return dispenserResourcesContext.allValues.filter(
      (d: DispenserResource) => d.location && d.location.level_name === currentFloorName,
    );
  }, [dispenserResourcesContext, currentFloorName]);

  return (
    <SVGOverlay {...otherProps}>
      <svg viewBox={viewBox}>
        {dispenserResourcesContext &&
          dispenserInCurLevel.map((dispenser: DispenserResource) => {
            return (
              <DispenserMarker
                key={dispenser.guid}
                guid={dispenser.guid}
                location={[dispenser.location.x, dispenser.location.y]}
                iconPath={dispenserResourcesContext.getIconPath(dispenser.guid) || undefined}
                footprint={footprint}
                onClick={onDispenserClick}
                aria-label={dispenser.guid}
                data-component="DispenserMarker"
              />
            );
          })}
      </svg>
    </SVGOverlay>
  );
};

export default DispensersOverlay;
