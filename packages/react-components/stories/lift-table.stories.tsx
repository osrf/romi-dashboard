import { Meta, Story } from '@storybook/react';
import React from 'react';
import { LiftTable } from '../lib';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

export default {
  title: 'Lift Table',
  component: LiftTable,
} as Meta;

const test_lifts: RomiCore.LiftState[] = [
  {
    lift_time: { sec: 0, nanosec: 0 },
    lift_name: 'lift42',
    available_floors: [],
    current_floor: 'L1',
    destination_floor: 'L4',
    door_state: RomiCore.LiftState.DOOR_CLOSED,
    motion_state: RomiCore.LiftState.MOTION_UP,
    available_modes: new Uint8Array(),
    current_mode: RomiCore.LiftState.MODE_AGV,
    session_id: '',
  },
  {
    lift_time: { sec: 0, nanosec: 0 },
    lift_name: 'lift43',
    available_floors: [],
    current_floor: 'B1',
    destination_floor: 'L3',
    door_state: RomiCore.LiftState.DOOR_CLOSED,
    motion_state: RomiCore.LiftState.MOTION_UP,
    available_modes: new Uint8Array(),
    current_mode: RomiCore.LiftState.MODE_AGV,
    session_id: '',
  },
];

export const LiftTableStory: Story = (args) => <LiftTable lifts={test_lifts} />;
