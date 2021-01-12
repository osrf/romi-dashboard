import { Story } from '@storybook/react';
import React from 'react';
import { RobotRoster } from '../lib';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

export default {
  title: 'Robot Roster',
};

interface RobotInfoProps {
  fleetName: string;
  robot: RomiCore.RobotState;
}

const story_robots: Array<RobotInfoProps> = Array(
  {
    fleetName: 'fleet1',
    robot: {
      name: 'robot1',
      battery_percent: 42.1,
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      model: 'model1',
      task_id: 'task1',
      path: [],
    },
  },
  {
    fleetName: 'fleet1',
    robot: {
      name: 'robot2',
      battery_percent: 45,
      mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
      model: 'model2',
      task_id: 'task2',
      path: [],
    },
  },
);

export const RobotRosterPanel: Story = (args) => {
  return <RobotRoster robots={story_robots} {...args} />;
};
