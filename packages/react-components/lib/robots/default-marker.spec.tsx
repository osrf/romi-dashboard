import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { RobotMarkerProps } from '../../lib';
import DefaultMarker from '../../lib/robots/default-marker';
import { makeRobot } from './test-utils.spec';

it('smoke test with different variants', () => {
  const variants: RobotMarkerProps['variant'][] = ['inConflict', 'normal', undefined];
  const robot = makeRobot();
  variants.forEach((v) => {
    render(
      <svg>
        <DefaultMarker
          color="blue"
          name={robot.name}
          model={robot.model}
          robotMode={robot.mode}
          x={robot.location.x}
          y={robot.location.y}
          yaw={robot.location.yaw}
          fleetName="test_fleet"
          footprint={1}
          variant={v}
        />
      </svg>,
    );
    cleanup();
  });
});
