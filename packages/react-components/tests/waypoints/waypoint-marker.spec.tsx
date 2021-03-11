import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { WaypointMarker } from '../../lib';

it('smoke test', () => {
  render(
    <svg>
      <WaypointMarker waypoint={{ name: 'test', params: [], x: 0, y: 0 }} />
    </svg>,
  );
  cleanup();

  render(
    <svg>
      <WaypointMarker waypoint={{ name: 'test', params: [], x: 0, y: 0 }} size={1} />
    </svg>,
  );
  cleanup();

  render(
    <svg>
      <WaypointMarker waypoint={{ name: 'test', params: [], x: 0, y: 0 }} translate={false} />
    </svg>,
  );
  cleanup();
});
