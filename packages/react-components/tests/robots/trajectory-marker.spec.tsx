import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { TrajectoryMarker, TrajectoryMarkerProps } from '../../lib';
import { makeTrajectory } from './test-utils';

it('smoke test with different variants and conflict states', () => {
  (['fill', 'follow', 'plain', undefined] as TrajectoryMarkerProps['variant'][]).forEach(
    (variant) => {
      render(
        <svg>
          <TrajectoryMarker
            trajectory={makeTrajectory()}
            color="green"
            conflict={false}
            variant={variant}
          />
          <TrajectoryMarker
            trajectory={makeTrajectory()}
            color="green"
            conflict={true}
            variant={variant}
          />
        </svg>,
      );
      cleanup();
    },
  );
});
