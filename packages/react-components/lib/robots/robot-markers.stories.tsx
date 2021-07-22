import { Grid, Paper, Typography } from '@material-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { RobotMarker, RobotMarkerProps } from './robot-marker';
import { makeRobot } from './test-utils.spec';

export default {
  title: 'Robot Markers',
  component: RobotMarker,
  parameters: { controls: { include: ['onClick'], hideNoControlsWarning: true } },
} as Meta;

function makeRobotMarkerProps(
  robotState?: Partial<RmfModels.RobotState>,
  props?: Partial<Omit<RobotMarkerProps, 'robot'>>,
): RobotMarkerProps {
  props = props || {};
  const robot = makeRobot(robotState);
  return {
    name: robot.name,
    model: robot.model,
    robotMode: robot.mode,
    x: robot.location.x,
    y: robot.location.y,
    yaw: robot.location.yaw,
    fleetName: 'testFleet',
    footprint: 1,
    ...props,
  };
}

const robotMarkerProps: Record<string, RobotMarkerProps> = {
  Basic: makeRobotMarkerProps({ name: 'BasicRobot' }),
  'Really Really Loooonnnnnggggg Name': makeRobotMarkerProps({
    name: 'I have a really really loooonnnnnggggg name',
  }),
  'In Conflict': makeRobotMarkerProps({ name: 'ConflictingRobot' }, { variant: 'inConflict' }),
  'Name With Space': makeRobotMarkerProps({ name: 'I have spaces' }),
  'With Icon': makeRobotMarkerProps(
    { name: 'RobotWithIcon', model: 'fleetWithIcon' },
    { fleetName: 'fleetWithIcon', iconPath: '/assets/tinyRobot.png' },
  ),
  'With Icon, In Conflict': makeRobotMarkerProps(
    { name: 'RobotWithIcon', model: 'fleetWithIcon' },
    { fleetName: 'fleetWithIcon', iconPath: '/assets/tinyRobot.png', variant: 'inConflict' },
  ),
};

export const Gallery: Story = (args) => {
  return (
    <Grid container spacing={2}>
      {Object.keys(robotMarkerProps).map((k) => (
        <Grid item key={k}>
          <Paper>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <Typography align="center">{k}</Typography>
              </Grid>
              <Grid item>
                <svg viewBox="-2 -2 4 4" style={{ minWidth: 200 }}>
                  <RobotMarker {...robotMarkerProps[k]} {...args} />
                </svg>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export const NoTranslate: Story = (args) => {
  const robotMarkerProps = makeRobotMarkerProps({
    location: {
      level_name: 'test',
      x: 10,
      y: 10,
      yaw: 0,
      t: { sec: 0, nanosec: 0 },
      index: 0,
    },
  });

  return (
    <svg viewBox="-2 -2 4 4" width={400} height={400}>
      <RobotMarker {...robotMarkerProps} translate={false} {...args} />
    </svg>
  );
};
