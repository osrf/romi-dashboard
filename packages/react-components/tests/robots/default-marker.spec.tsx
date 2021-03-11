import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { RobotMarkerProps } from '../../lib';
import DefaultMarker from '../../lib/robots/default-marker';
import { makeRobot } from './test-utils';

it('smoke test with different variants', () => {
  const variants: RobotMarkerProps['variant'][] = ['inConflict', 'normal', undefined];
  variants.forEach((v) => {
    render(
      <svg>
        <DefaultMarker
          color="blue"
          robot={makeRobot()}
          fleetName="test_fleet"
          footprint={1}
          variant={v}
        />
      </svg>,
    );
    cleanup();
  });
});
