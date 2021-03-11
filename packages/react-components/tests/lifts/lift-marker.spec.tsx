import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LiftMarker, LiftMarkerProps } from '../../lib';
import { allLiftModes, allLiftMotion, makeLift, makeLiftState } from './test-utils';

it('smoke test with different variants', () => {
  ([
    'emergency',
    'fire',
    'human',
    'moving',
    'offLine',
    'onCurrentFloor',
    'unknown',
    undefined,
  ] as LiftMarkerProps['variant'][]).forEach((variant) => {
    render(
      <svg>
        <LiftMarker lift={makeLift()} liftState={makeLiftState()} variant={variant} />
      </svg>,
    );
    cleanup();
  });
});

it('smoke test with translate false', () => {
  render(
    <svg>
      <LiftMarker lift={makeLift()} liftState={makeLiftState()} translate={false} />
    </svg>,
  );
});

it('smoke test with different modes', () => {
  allLiftModes()
    .map((mode) =>
      makeLiftState({
        current_mode: mode,
      }),
    )
    .forEach((state) => {
      render(
        <svg>
          <LiftMarker lift={makeLift()} liftState={state} />
        </svg>,
      );
      cleanup();
    });
});

it('smoke test with different motions', () => {
  allLiftMotion()
    .map((motion) =>
      makeLiftState({
        motion_state: motion,
      }),
    )
    .forEach((state) => {
      render(
        <svg>
          <LiftMarker lift={makeLift()} liftState={state} />
        </svg>,
      );
      cleanup();
    });
});

it('smoke test with no state', () => {
  render(
    <svg>
      <LiftMarker lift={makeLift()} />
    </svg>,
  );
});

it('trigger onClick event', () => {
  const mockOnClick = jasmine.createSpy();
  const root = render(
    <svg>
      <LiftMarker
        lift={makeLift()}
        liftState={makeLiftState()}
        onClick={mockOnClick}
        data-testid="marker"
      />
    </svg>,
  );
  userEvent.click(root.getByTestId('marker'));
  expect(mockOnClick).toHaveBeenCalled();
});
