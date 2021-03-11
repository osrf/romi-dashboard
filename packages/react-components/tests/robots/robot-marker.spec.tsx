import { act, cleanup, render as render_, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ColorContext, ColorManager, RobotMarker, RobotMarkerProps } from '../../lib';
import { makeRobot } from './test-utils';

describe('robot-markers', () => {
  let colorManager: ColorManager;
  let fakeOnClick: ReturnType<typeof jasmine.createSpy>;

  beforeEach(() => {
    colorManager = new ColorManager();
    fakeOnClick = jasmine.createSpy();
  });

  async function render(Component: JSX.Element): Promise<RenderResult> {
    let root: RenderResult;
    await act(async () => {
      root = render_(
        <ColorContext.Provider value={colorManager}>
          <svg>{Component}</svg>
        </ColorContext.Provider>,
      );
    });

    return root!;
  }

  it('smoke test with different variant', async () => {
    const variants: RobotMarkerProps['variant'][] = ['inConflict', 'normal', undefined];
    for (const v of variants) {
      await render(
        <RobotMarker robot={makeRobot()} fleetName="test_fleet" footprint={1} variant={v} />,
      );
      cleanup();
    }
  });

  it('trigger onClick event', async () => {
    const root = await render(
      <RobotMarker
        robot={makeRobot()}
        fleetName="test_fleet"
        footprint={1}
        onClick={fakeOnClick}
        data-testid="marker"
      />,
    );
    userEvent.click(root.getByTestId('marker'));
    expect(fakeOnClick).toHaveBeenCalled();
  });

  it('providing iconPath renders an image', async () => {
    const root = await render(
      <RobotMarker robot={makeRobot()} fleetName="test_fleet" footprint={1} iconPath="test_icon" />,
    );
    expect(root.container.querySelector('image')).not.toBeNull();
  });
});
