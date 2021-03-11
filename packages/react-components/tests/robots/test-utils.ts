import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { RawKnot, RawVelocity, Trajectory } from '../../lib';

export function allRobotModes(): RomiCore.RobotMode[] {
  return [
    { mode: RomiCore.RobotMode.MODE_ADAPTER_ERROR },
    { mode: RomiCore.RobotMode.MODE_CHARGING },
    { mode: RomiCore.RobotMode.MODE_DOCKING },
    { mode: RomiCore.RobotMode.MODE_EMERGENCY },
    { mode: RomiCore.RobotMode.MODE_GOING_HOME },
    { mode: RomiCore.RobotMode.MODE_IDLE },
    { mode: RomiCore.RobotMode.MODE_MOVING },
    { mode: RomiCore.RobotMode.MODE_PAUSED },
    { mode: RomiCore.RobotMode.MODE_WAITING },
    { mode: -1 },
  ];
}

export function makeRobot(robotState?: Partial<RomiCore.RobotState>): RomiCore.RobotState {
  return {
    name: 'test',
    battery_percent: 1,
    location: { level_name: 'test_level', x: 0, y: 0, yaw: 0, t: { sec: 0, nanosec: 0 } },
    mode: { mode: RomiCore.RobotMode.MODE_PAUSED },
    model: 'test_model',
    task_id: 'test_task_id',
    path: [],
    ...robotState,
  };
}

export function makeTrajectory(traj?: Partial<Trajectory>): Trajectory {
  return {
    id: 0,
    dimensions: 1,
    fleet_name: 'test_fleet',
    robot_name: 'test_robot',
    map_name: 'test_map',
    segments: [
      {
        t: 0,
        v: [0, 0, 0.0],
        x: [0, 0, 0],
      },
      {
        t: 1000,
        v: [10, 0, 0],
        x: [10, 0, 0],
      },
    ],
    shape: 'circle',
    ...traj,
  };
}

/***
 * Some documentation on the +ve and -ve signs and the directions that they represent
 * before I or anyone get lost reading through code
 *
 * +ve X = right
 * -ve X = left
 *
 * +ve Y = up
 * -ve Y = down
 *
 * +ve theta = turn right
 * -ve theta = turn left
 *
 * Direction of the velocity is handled in determineVelocity function
 */

const startingTheta = {
  vertical: {
    value: -1.5643726408832297,
    direction: {
      up: 'up',
      down: 'down',
    },
  },
  horizontal: {
    value: -3.1376738367181622,
    direction: {
      left: 'left',
      right: 'right',
    },
  },
};

/***
 * This function is used to generate a random number for
 * various situations stated below:
 *
 * 1) Generating number of waypoints on a straight path per turn
 * 2) Generating a number (0 or 1) to decide turning direction
 * 3) Staring points for x and y
 * 4) Starting configuration
 */
const generateNumber = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max + 1);
  return Math.floor(Math.random() * (max - min) + min);
};

/***
 * This function is used to determine RawVelocity at each turn
 */
const determineVelocity = (theta: number, direction: string, velocity: number): RawVelocity => {
  if (direction === 'up') return [0.0, velocity, theta];
  else if (direction === 'down') return [0.0, -velocity, 0.0];
  else if (direction === 'right') return [velocity, 0.0, theta];
  else return [-velocity, 0.0, 0.0];
};

/**
 * determine the index to retrieve velocity in RawVelocity
 */
const determineVelocityIndex = (direction: string): number => {
  switch (direction) {
    case 'up':
    case 'down':
      return 1;
    case 'left':
    case 'right':
      return 0;
    default:
      return 2;
  }
};

/**
 * turning direction, 0 = right and 1 = left
 */
const determineThetaVelocity = (direction: number, thetaVelocity: number): number => {
  return direction === 0 ? thetaVelocity : -thetaVelocity;
};

/**
 * Calculate next theta
 */
const calculateTheta = (currTheta: number, thetaVelocity: number): number => {
  if (currTheta + thetaVelocity > Math.PI) {
    return -Math.PI + (currTheta + thetaVelocity - Math.PI);
  } else if (currTheta + thetaVelocity < -Math.PI) {
    return Math.PI - (currTheta + thetaVelocity + Math.PI);
  } else {
    return currTheta + thetaVelocity;
  }
};

/**
 * determine the direction of the straight segment after making a turn
 */
const determineDirection = (currDir: string, thetaVelocity: number): string => {
  if (currDir === 'up' && thetaVelocity > 0) return 'right';
  else if (currDir === 'up' && thetaVelocity < 0) return 'left';
  else if (currDir === 'down' && thetaVelocity > 0) return 'right';
  else if (currDir === 'down' && thetaVelocity < 0) return 'left';
  else if (currDir === 'right' && thetaVelocity > 0) return 'up';
  else if (currDir === 'right' && thetaVelocity < 0) return 'down';
  else if (currDir === 'left' && thetaVelocity > 0) return 'up';
  else return 'down';
};

/**
 * 5 < startX < 20
 * -11 < startY < -7
 */
const createSegments = (
  startX: number,
  startY: number,
  startTheta: number,
  direction: string,
): RawKnot[] => {
  // Change the number of turning points, start time and velocity here
  let turningPoints = 2;
  let startTime = 2000;
  const velocity = 0.5;
  const segment: RawKnot[] = [];
  const interval = 500;
  const thetaVelocity = 0.25 * Math.PI;

  let currVelocity = determineVelocity(startTheta, direction, velocity);
  let currVelocityIndex = startTheta > -Math.PI * 0.5 ? 1 : 0;
  let currX = startX;
  let currY = startY;
  let currTheta = startTheta;
  let currDirection = direction;

  while (turningPoints > -1) {
    // generate number of waypoints per turn
    const pointsPerStraightSegment = generateNumber(8, 10);

    // generate points for a straight segment
    for (let i = 0; i < pointsPerStraightSegment; i++) {
      segment.push({ t: startTime, v: currVelocity, x: [currX, currY, currTheta] });

      startTime += interval;
      const distance = currVelocity[currVelocityIndex] * (interval / 1000);
      currX = currVelocityIndex === 0 ? (currX += distance) : currX;
      currY = currVelocityIndex === 1 ? (currY += distance) : currY;
    }

    if (turningPoints > 0) {
      // static point before turning
      startTime += interval;
      const turningDirection = generateNumber(0, 1);
      const currThetaVelocity = determineThetaVelocity(turningDirection, thetaVelocity);
      segment.push({
        t: startTime,
        v: [0.0, 0.0, currThetaVelocity],
        x: [currX, currY, currTheta],
      });

      // 2 points needed to turn at a speed of 1/4 Radian per second
      for (let i = 0; i < 2; i++) {
        const thetaHolder = calculateTheta(currTheta, currThetaVelocity);
        currTheta = thetaHolder;
        startTime += 500;
        segment.push({
          t: startTime,
          v: [0.0, 0.0, currThetaVelocity],
          x: [currX, currY, currTheta],
        });
      }

      // last static point after finishing the turn
      startTime += interval;
      segment.push({ t: startTime, v: [0.0, 0.0, 0.0], x: [currX, currY, currTheta] });

      // prep for next straight segment
      currDirection = determineDirection(currDirection, currThetaVelocity);
      currVelocity = determineVelocity(0.0, currDirection, velocity);
      currVelocityIndex = determineVelocityIndex(currDirection);
      startTime += interval;
    }

    turningPoints -= 1;
  }
  return segment;
};

/**
 * Create a bunch of trajectories
 * numberOfTraj must be >= 1
 */
export const createRandomTrajectories = (numberOfTraj: number): Trajectory[] => {
  const trajHolder = [];

  for (let i = 0; i < numberOfTraj; i++) {
    let knotHolder: RawKnot[] = [];
    const startX = generateNumber(0, 20);
    const startY = generateNumber(0, -20);
    const startConfiguration = generateNumber(1, 4);

    switch (startConfiguration) {
      case 1:
        knotHolder = createSegments(
          startX,
          startY,
          startingTheta.horizontal.value,
          startingTheta.horizontal.direction.right,
        );
        break;
      case 2:
        knotHolder = createSegments(
          startX,
          startY,
          startingTheta.horizontal.value,
          startingTheta.horizontal.direction.left,
        );
        break;
      case 3:
        knotHolder = createSegments(
          startX,
          startY,
          startingTheta.vertical.value,
          startingTheta.vertical.direction.up,
        );
        break;
      case 4:
        knotHolder = createSegments(
          startX,
          startY,
          startingTheta.vertical.value,
          startingTheta.vertical.direction.down,
        );
        break;
    }
    trajHolder.push({
      dimensions: 0.3,
      fleet_name: 'tinyRobot',
      id: i,
      robot_name: 'tinyRobot' + i.toString(),
      segments: knotHolder,
      shape: 'circle',
      map_name: 'L1',
    });
  }
  return trajHolder;
};
