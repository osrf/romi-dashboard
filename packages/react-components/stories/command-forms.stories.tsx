import { Meta, Story } from '@storybook/react';
import React from 'react';
import { DeliveryRequestForm, LoopRequestForm } from '../lib';
import { availableDispensers, availablePlaces, fleets } from '../tests/commands/test-data';

export default {
  title: 'Command Forms',
  argTypes: {
    doLoopRequest: { action: 'loop request' },
    doDeliveryRequest: { action: 'delivery request' },
  },
} as Meta;

export const DeliveryRequest: Story = (args) => (
  // add a background to visualize different theme colors properly
  <div style={{ backgroundColor: '#A8A8A8', padding: '1rem' }}>
    <DeliveryRequestForm
      fleetNames={fleets}
      availablePlaces={availablePlaces}
      availableDispensers={availableDispensers}
      {...args}
    />
  </div>
);

export const LoopRequest: Story = (args) => (
  // add a background to visualize different theme colors properly
  <div style={{ backgroundColor: '#A8A8A8', padding: '1rem' }}>
    <LoopRequestForm fleetNames={fleets} availablePlaces={availablePlaces} {...args} />
  </div>
);
