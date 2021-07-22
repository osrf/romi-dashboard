import { Accordion, AccordionProps, makeStyles } from '@material-ui/core';
import * as RmfModels from 'rmf-models';
import Debug from 'debug';
import React from 'react';
import ItemAccordionDetails from '../item-accordion-details';
import ItemAccordionSummary from '../item-accordion-summary';
import { SimpleInfo } from '../simple-info';
import { robotModeToString } from './utils';
import { Map as LMap } from 'react-leaflet';

const debug = Debug('Robots:RobotAccordion');

const useStyles = makeStyles((theme) => ({
  robotStatusLabel: {
    borderColor: theme.palette.info.main,
  },
}));

interface RobotInfoProps {
  fleetName: string;
  robot: RmfModels.RobotState;
}

const RobotInfo = (props: RobotInfoProps) => {
  const { fleetName, robot } = props;

  const data = [
    { name: 'Name', value: robot.name },
    { name: 'Model', value: robot.model },
    { name: 'Fleet', value: fleetName },
    {
      name: 'Location',
      value: `${robot.location.level_name} (${robot.location.x.toFixed(
        3,
      )}, ${robot.location.y.toFixed(3)})`,
    },
    { name: 'Yaw', value: robot.location.yaw.toFixed(3) },
    { name: 'Task Id', value: robot.task_id },
    { name: 'Battery', value: robot.battery_percent.toFixed(0) },
  ];

  return <SimpleInfo infoData={data} />;
};

export interface RobotAccordionProps extends Omit<AccordionProps, 'children'> {
  fleetName: string;
  robot: RmfModels.RobotState;
  mapRef?: React.RefObject<LMap>;
}

export const RobotAccordion = React.forwardRef(
  (props: RobotAccordionProps, ref: React.Ref<HTMLElement>) => {
    const { fleetName, robot, mapRef, ...otherProps } = props;
    debug(`render ${robot.name}`);
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    function onAccordianClick(robot: RmfModels.RobotState, mapRef?: React.RefObject<LMap>) {
      setExpanded(!expanded);
      expanded
        ? mapRef?.current?.leafletElement.setView([-66.375, 154.5], 2)
        : mapRef?.current?.leafletElement.setView([robot.location.y, robot.location.x], 5);
    }

    return (
      <Accordion ref={ref} {...otherProps}>
        <ItemAccordionSummary
          title={robot.name}
          statusProps={{
            className: classes.robotStatusLabel,
            text: robotModeToString(robot.mode),
          }}
          onAccordianClick={() => onAccordianClick(robot, mapRef)}
        />
        <ItemAccordionDetails>
          <RobotInfo fleetName={fleetName} robot={robot} />
        </ItemAccordionDetails>
      </Accordion>
    );
  },
);

export default RobotAccordion;
