import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { cleanup, render, within } from '@testing-library/react';
import React from 'react';
import { RobotAccordion } from '../../lib';
import { allRobotModes, makeRobot } from './test-utils';

it('smoke test with different robot modes', () => {
  allRobotModes()
    .map((mode) =>
      makeRobot({
        mode,
      }),
    )
    .forEach((robot) => {
      render(<RobotAccordion fleetName="test_fleet" robot={robot} />);
      cleanup();
    });
});

it('renders basic robot information', () => {
  const robot = makeRobot({
    name: 'test_robot',
    battery_percent: 1,
    location: { level_name: 'test_level', x: 0, y: 0, yaw: 0, t: { sec: 0, nanosec: 0 } },
    mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
    model: 'test_model',
    task_id: 'test_task_id',
    path: [],
  });
  const accordion = render(<RobotAccordion fleetName="test_fleet" robot={robot} />);
  const rows = accordion.queryAllByRole('row', { hidden: true });

  const nameRow = rows.find((r) => r.getAttribute('aria-label') === 'Name')!;
  expect(nameRow).toBeTruthy();
  expect(within(nameRow).queryByText('test_robot')).toBeTruthy();

  const model = rows.find((r) => r.getAttribute('aria-label') === 'Model')!;
  expect(model).toBeTruthy();
  expect(within(model).queryByText('test_model')).toBeTruthy();

  const fleet = rows.find((r) => r.getAttribute('aria-label') === 'Fleet')!;
  expect(fleet).toBeTruthy();
  expect(within(fleet).queryByText('test_fleet')).toBeTruthy();

  const location = rows.find((r) => r.getAttribute('aria-label') === 'Location')!;
  expect(location).toBeTruthy();
  expect(within(location).queryByText('test_level (0.000, 0.000)')).toBeTruthy();

  const yaw = rows.find((r) => r.getAttribute('aria-label') === 'Yaw')!;
  expect(yaw).toBeTruthy();
  expect(within(yaw).queryByText('0.000')).toBeTruthy();

  const taskId = rows.find((r) => r.getAttribute('aria-label') === 'Task Id')!;
  expect(taskId).toBeTruthy();
  expect(within(taskId).queryByText('test_task_id')).toBeTruthy();

  const battery = rows.find((r) => r.getAttribute('aria-label') === 'Battery')!;
  expect(battery).toBeTruthy();
  expect(within(battery).queryByText('1')).toBeTruthy();
});
