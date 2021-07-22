import { Meta, Story } from '@storybook/react';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { RobotMarker } from '../robots';
import { makeRobot } from '../robots/test-utils.spec';

export default {
  title: 'Benchmarks/Robots',
  argTypes: {
    count: {
      name: 'Count',
      control: {
        type: 'number',
      },
    },
  },
} as Meta;

interface RobotMarkerArgs {
  count: number;
}

interface AnimationState {
  robot: RmfModels.RobotState;
  target: [number, number];
  heading: [number, number];
}

export const RobotMarkers: Story<RobotMarkerArgs> = ({ count, ...args }) => {
  const setTriggerRender = React.useState(0)[1];

  const animationStates = React.useMemo(() => {
    const states: AnimationState[] = [];

    for (let i = 0; i < count; i++) {
      const robot = makeRobot({
        name: `test_${i}`,
        location: {
          level_name: 'test_level',
          x: Math.random() * 20,
          y: -Math.random() * 20,
          yaw: 0,
          t: { sec: 0, nanosec: 0 },
          index: 0,
        },
      });
      const target: [number, number] = [Math.random() * 20, -Math.random() * 20];
      const headingYaw = Math.atan2(target[1] - robot.location.y, target[0] - robot.location.x);
      const heading: [number, number] = [Math.cos(headingYaw), Math.sin(headingYaw)];
      robot.location.yaw = headingYaw;

      states.push({
        robot,
        target,
        heading,
      });
    }
    return states;
  }, [count]);

  React.useEffect(() => {
    let prevUpdate = performance.now();
    const speed = 2;
    let stop = false;

    const updateState = (t: number) => {
      if (stop) {
        return;
      }

      const dt = t - prevUpdate;

      for (let i = 0; i < count; i++) {
        const state = animationStates[i];
        const distSq =
          (state.target[0] - state.robot.location.x) ** 2 +
          (state.target[1] - state.robot.location.y) ** 2;
        if (distSq < 2) {
          state.target = [Math.random() * 20, -Math.random() * 20];
          const headingYaw = Math.atan2(
            state.target[1] - state.robot.location.y,
            state.target[0] - state.robot.location.x,
          );
          state.heading = [Math.cos(headingYaw), Math.sin(headingYaw)];
          state.robot.location.yaw = headingYaw;
        }
        state.robot.location.x += (state.heading[0] * speed * dt) / 1000;
        state.robot.location.y += (state.heading[1] * speed * dt) / 1000;
      }

      prevUpdate = t;

      setTriggerRender((prev) => prev + 1);
      window.requestAnimationFrame(updateState);
    };
    window.requestAnimationFrame(updateState);

    return () => {
      stop = true;
    };
  }, [count, animationStates, setTriggerRender]);

  return (
    <svg viewBox="0 0 20 20" style={{ width: '100%', height: '100%', position: 'absolute' }}>
      {animationStates.map(({ robot }) => (
        <RobotMarker
          key={robot.name}
          name={robot.name}
          robotMode={robot.mode}
          model={robot.model}
          x={robot.location.x}
          y={robot.location.y}
          yaw={robot.location.yaw}
          fleetName="test_fleet"
          footprint={1}
          {...args}
        />
      ))}
    </svg>
  );
};
RobotMarkers.args = {
  count: 100,
};
