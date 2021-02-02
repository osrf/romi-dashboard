import { Meta, Story } from '@storybook/react';
import React from 'react';
import { DoorTable } from '../lib';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

export default {
  title: 'Door Table',
  component: DoorTable,
} as Meta;

const test_doors: RomiCore.DoorState[] = [
  {
    door_name: 'door1',
    door_time: { sec: 0, nanosec: 0 },
    current_mode: { value: RomiCore.DoorMode.MODE_CLOSED },
  },
  {
    door_name: 'door2',
    door_time: { sec: 0, nanosec: 0 },
    current_mode: { value: RomiCore.DoorMode.MODE_OPEN },
  },
];

export const DoorTableStory: Story = (args) => <DoorTable doors={test_doors} />;
