import React from 'react';
import { SystemSummaryItemState, DoorSummary, RobotSummary, RobotSummaryState } from '../lib';
import { Meta, Story } from '@storybook/react';

export default {
  title: 'Systems summary item',
  component: SystemSummaryItemState,
} as Meta;

const itemSummary: DoorSummary = {
  operational: 0,
  spoiltItem: [],
};

const robotSummary: RobotSummary = {
  operational: 0,
  idle: 0,
  charging: 0,
  spoiltRobots: [],
};

export const SystemSummaryItemStateStory: Story = (args) => (
  <React.Fragment>
    <SystemSummaryItemState
      item={'Door'}
      doorSummary={itemSummary}
      onClick={() => {
        /**filler */
      }}
      {...args}
    />
    <RobotSummaryState
      item={'Robots'}
      robotSummary={robotSummary}
      onClick={() => {
        /**filler */
      }}
      {...args}
    />
  </React.Fragment>
);
