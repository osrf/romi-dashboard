import { makeStyles } from '@material-ui/core';
import Accordion, { AccordionProps } from '@material-ui/core/Accordion';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Debug from 'debug';
import React from 'react';
import * as RmfModels from 'rmf-models';
import ItemAccordionDetails from '../item-accordion-details';
import ItemAccordionSummary from '../item-accordion-summary';
import { SimpleInfo, SimpleInfoData } from '../simple-info';
import { Map as LMap } from 'react-leaflet';

const debug = Debug('Doors:DoorAccordion');

const useStyles = makeStyles((theme) => ({
  controlButtonGroup: {
    marginTop: theme.spacing(1),
  },
  doorLabelOpen: {
    borderColor: theme.palette.success.main,
  },
  doorLabelClosed: {
    borderColor: theme.palette.error.main,
  },
  doorLabelMoving: {
    borderColor: theme.palette.warning.main,
  },
}));

function doorTypeToString(doorType: number): string {
  switch (doorType) {
    case RmfModels.Door.DOOR_TYPE_DOUBLE_SLIDING:
      return 'Double Sliding';
    case RmfModels.Door.DOOR_TYPE_DOUBLE_SWING:
      return 'Double Swing';
    case RmfModels.Door.DOOR_TYPE_DOUBLE_TELESCOPE:
      return 'Double Telescope';
    case RmfModels.Door.DOOR_TYPE_SINGLE_SLIDING:
      return 'Single Sliding';
    case RmfModels.Door.DOOR_TYPE_SINGLE_SWING:
      return 'Single Swing';
    case RmfModels.Door.DOOR_TYPE_SINGLE_TELESCOPE:
      return 'Single Telescope';
    default:
      return `Unknown (${doorType})`;
  }
}

function doorModeToString(doorState?: RmfModels.DoorState): string {
  if (!doorState) {
    return 'N/A';
  }
  switch (doorState.current_mode.value) {
    case RmfModels.DoorMode.MODE_OPEN:
      return 'OPEN';
    case RmfModels.DoorMode.MODE_CLOSED:
      return 'CLOSED';
    case RmfModels.DoorMode.MODE_MOVING:
      return 'MOVING';
    default:
      return 'N/A';
  }
}

function motionDirectionToString(motionDirection: number): string {
  switch (motionDirection) {
    case 1:
      return 'Clockwise';
    case -1:
      return 'Anti-Clockwise';
    default:
      return `Unknown (${motionDirection})`;
  }
}

function getDoorCenter(door: RmfModels.Door): [number, number] {
  const v1 = [door.v1_x, door.v1_y];
  const v2 = [door.v2_x, door.v2_y];
  switch (door.door_type) {
    case RmfModels.Door.DOOR_TYPE_SINGLE_SLIDING:
    case RmfModels.Door.DOOR_TYPE_SINGLE_SWING:
    case RmfModels.Door.DOOR_TYPE_SINGLE_TELESCOPE:
    case RmfModels.Door.DOOR_TYPE_DOUBLE_SLIDING:
    case RmfModels.Door.DOOR_TYPE_DOUBLE_SWING:
    case RmfModels.Door.DOOR_TYPE_DOUBLE_TELESCOPE:
      return [(v1[0] + v2[0]) / 2, (v2[1] + v1[1]) / 2];
    default:
      throw new Error('unknown door type');
  }
}

interface DoorInfoProps {
  door: RmfModels.Door;
}

const DoorInfo = (props: DoorInfoProps) => {
  const { door } = props;

  const data = [
    { name: 'Name', value: door.name },
    { name: 'Type', value: doorTypeToString(door.door_type) },
    { name: 'Motion Direction', value: motionDirectionToString(door.motion_direction) },
    { name: 'Motion Range', value: door.motion_range.toFixed(3) },
    { name: 'Location', value: `(${door.v1_x.toFixed(3)}, ${door.v1_y.toFixed(3)})` },
  ] as SimpleInfoData[];

  return <SimpleInfo infoData={data} />;
};

export interface DoorAccordionProps extends Omit<AccordionProps, 'children'> {
  door: RmfModels.Door;
  doorState?: RmfModels.DoorState;
  onDoorControlClick?(event: React.MouseEvent, door: RmfModels.Door, mode: number): void;
  mapRef?: React.RefObject<LMap>;
}

export const DoorAccordion = React.forwardRef(
  (props: DoorAccordionProps, ref: React.Ref<HTMLElement>) => {
    const { door, doorState, onDoorControlClick, mapRef, ...otherProps } = props;
    debug(`render ${door.name}`);
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    function onAccordianClick(door: RmfModels.Door, mapRef?: React.RefObject<LMap>) {
      const center = getDoorCenter(door);
      setExpanded(!expanded);
      expanded
        ? mapRef?.current?.leafletElement.setView([-66.375, 154.5], 2)
        : mapRef?.current?.leafletElement.setView([center[1], center[0]], 5);
    }

    const doorModeLabelClasses = React.useCallback(
      (doorState?: RmfModels.DoorState): string | null => {
        if (!doorState) {
          return null;
        }
        switch (doorState.current_mode.value) {
          case RmfModels.DoorMode.MODE_OPEN:
            return `${classes.doorLabelOpen}`;
          case RmfModels.DoorMode.MODE_CLOSED:
            return `${classes.doorLabelClosed}`;
          case RmfModels.DoorMode.MODE_MOVING:
            return `${classes.doorLabelMoving}`;
          default:
            return null;
        }
      },
      [classes],
    );

    const doorStatusClass = doorModeLabelClasses(doorState);

    return (
      <Accordion ref={ref} {...otherProps}>
        <ItemAccordionSummary
          title={door.name}
          statusProps={{
            className: doorStatusClass ? doorStatusClass : undefined,
            text: doorModeToString(doorState),
            variant: doorState ? 'normal' : 'unknown',
          }}
          onAccordianClick={() => onAccordianClick(door, mapRef)}
        />
        <ItemAccordionDetails>
          <DoorInfo door={door} />
          {onDoorControlClick && (
            <ButtonGroup className={classes.controlButtonGroup} fullWidth>
              <Button
                onClick={(ev) => onDoorControlClick(ev, door, RmfModels.DoorMode.MODE_CLOSED)}
              >
                Close
              </Button>
              <Button onClick={(ev) => onDoorControlClick(ev, door, RmfModels.DoorMode.MODE_OPEN)}>
                Open
              </Button>
            </ButtonGroup>
          )}
        </ItemAccordionDetails>
      </Accordion>
    );
  },
);

export default DoorAccordion;
