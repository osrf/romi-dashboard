import * as RomiCore from '@osrf/romi-js-core-interfaces';

function superFleet(): RomiCore.FleetState {
  const robots: RomiCore.RobotState[] = [];
  for (let i = 1; i <= 20; i++) {
    robots.push({
      name: `Geth${i}`,
      model: 'TeRmInAtOr',
      mode: { mode: RomiCore.RobotMode.MODE_MOVING },
      location: {
        level_name: 'L1',
        x: i,
        y: -2,
        yaw: ((i * 0.1) % 2) * Math.PI,
        t: { sec: 0, nanosec: 0 },
      },
      battery_percent: 100,
      path: [],
      task_id: 'taskA',
    });
  }

  return {
    name: 'SuperFleet',
    robots: robots,
  };
}

export default function fakeFleets(): RomiCore.FleetState[] {
  return [
    {
      name: 'Fleet1',
      robots: [
        {
          name: 'Robot1',
          model: 'Model1',
          mode: { mode: RomiCore.RobotMode.MODE_EMERGENCY },
          location: {
            level_name: 'L1',
            x: 4,
            y: -12,
            yaw: 0,
            t: { sec: 0, nanosec: 0 },
          },
          battery_percent: 100,
          path: [],
          task_id: 'task1',
        },
      ],
    },
    {
      name: 'Fleet2',
      robots: [
        {
          name: 'Robot2',
          model: 'Model2',
          mode: { mode: RomiCore.RobotMode.MODE_EMERGENCY },
          location: {
            level_name: 'L2',
            x: 4,
            y: -12,
            yaw: 0,
            t: { sec: 0, nanosec: 0 },
          },
          battery_percent: 100,
          path: [],
          task_id: 'task2',
        },
      ],
    },
    {
      name: 'tinyRobot',
      robots: [
        {
          name: 'tinyRobot1',
          model: 'tinyRobot',
          mode: { mode: RomiCore.RobotMode.MODE_MOVING },
          location: {
            level_name: 'L1',
            x: 2,
            y: -5,
            yaw: 0,
            t: { sec: 0, nanosec: 0 },
          },
          battery_percent: 100,
          path: [],
          task_id: 'taskA',
        },
        {
          name: 'tinyRobot2',
          model: 'tinyRobot',
          mode: { mode: RomiCore.RobotMode.MODE_MOVING },
          location: {
            level_name: 'L1',
            x: 12,
            y: -10,
            yaw: 0,
            t: { sec: 0, nanosec: 0 },
          },
          battery_percent: 100,
          path: [],
          task_id: 'taskB',
        },
      ],
    },
    {
      name: 'FleetA',
      robots: [
        {
          name: 'RobotA',
          model: 'ModelA',
          mode: { mode: RomiCore.RobotMode.MODE_MOVING },
          location: {
            level_name: 'L2',
            x: 2,
            y: -5,
            yaw: 0,
            t: { sec: 0, nanosec: 0 },
          },
          battery_percent: 100,
          path: [],
          task_id: 'taskA',
        },
      ],
    },
    {
      name: 'FleetB',
      robots: [
        {
          name: 'RobotC',
          model: 'ModelC',
          mode: { mode: RomiCore.RobotMode.MODE_EMERGENCY },
          location: {
            level_name: 'L2',
            x: 4,
            y: -12,
            yaw: 0,
            t: { sec: 0, nanosec: 0 },
          },
          battery_percent: 100,
          path: [],
          task_id: 'taskC',
        },
      ],
    },
    superFleet(),
  ];
}
