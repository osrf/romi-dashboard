import { act, cleanup, render as render_, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ColorContext, ColorManager } from '..';
import { RobotMarker, RobotMarkerProps } from './robot-marker';
import { makeRobot } from './test-utils.spec';

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
    const robot = makeRobot();
    for (const v of variants) {
      await render(
        <RobotMarker
          name={robot.name}
          model={robot.model}
          robotMode={robot.mode}
          x={robot.location.x}
          y={robot.location.y}
          yaw={robot.location.yaw}
          fleetName="test_fleet"
          footprint={1}
          variant={v}
        />,
      );
      cleanup();
    }
  });

  it('trigger onClick event', async () => {
    const robot = makeRobot();
    const root = await render(
      <RobotMarker
        name={robot.name}
        model={robot.model}
        robotMode={robot.mode}
        x={robot.location.x}
        y={robot.location.y}
        yaw={robot.location.yaw}
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
    const robot = makeRobot();
    const root = await render(
      <RobotMarker
        name={robot.name}
        model={robot.model}
        robotMode={robot.mode}
        x={robot.location.x}
        y={robot.location.y}
        yaw={robot.location.yaw}
        fleetName="test_fleet"
        footprint={1}
        iconPath="test_icon"
      />,
    );
    expect(root.container.querySelector('image')).not.toBeNull();
  });
});
