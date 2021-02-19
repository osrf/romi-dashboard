import { createMount } from '@material-ui/core/test-utils';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as L from 'leaflet';
import React from 'react';
import { robotHash } from 'react-components';
import { act } from 'react-dom/test-utils';
import { Map as LMap } from 'react-leaflet';
import { Conflict, Trajectory } from '../../../managers/robot-trajectory-manager';
import FakeTrajectoryManager from '../../../managers/__mocks__/robot-trajectory-manager';
import { defaultSettings, TrajectoryAnimation } from '../../../settings';
import { SettingsContext } from '../../app-contexts';
import RobotTrajectoriesOverlay from '../robot-trajectories-overlay';

const mount = createMount();
const mapBound = new L.LatLngBounds([0, 25.794363144785166], [-17.53525484725833, 0]);

const robots: Record<string, RomiCore.RobotState> = {
  [robotHash('tinyRobot1', 'tinyRobot')]: {
    name: 'tinyRobot1',
    battery_percent: 100,
    location: { level_name: 'L1', x: 0, y: 0, yaw: 0, t: { sec: 0, nanosec: 0 } },
    mode: { mode: RomiCore.RobotMode.MODE_IDLE },
    model: 'tinyRobot',
    path: [],
    task_id: '',
  },
  [robotHash('tinyRobot2', 'tinyRobot')]: {
    name: 'tinyRobot2',
    battery_percent: 100,
    location: { level_name: 'L1', x: 0, y: 0, yaw: 0, t: { sec: 0, nanosec: 0 } },
    mode: { mode: RomiCore.RobotMode.MODE_IDLE },
    model: 'tinyRobot',
    path: [],
    task_id: '',
  },
};

const createWrapper = async (
  bounds: L.LatLngBoundsExpression,
  conflicts: Conflict[],
  robots: Record<string, RomiCore.RobotState>,
  trajs: Trajectory[],
) => {
  const settings = defaultSettings();
  // animations use apis not supported in jsdom
  settings.trajectoryAnimation = TrajectoryAnimation.None;
  let wrapper: ReactWrapper;
  await act(
    async () =>
      (wrapper = mount(
        <LMap>
          <SettingsContext.Provider value={settings}>
            <RobotTrajectoriesOverlay
              bounds={bounds}
              robots={robots}
              trajectories={trajs}
              conflicts={conflicts}
            />
          </SettingsContext.Provider>
        </LMap>,
      )),
  );
  return wrapper!;
};

describe('RobotTrajectoriesOverlay', () => {
  let trajMgr;
  let trajectoryData;
  let trajectoryValue: Trajectory;
  let trajectoryConflict: Conflict[];

  beforeEach(async () => {
    trajMgr = new FakeTrajectoryManager();
    trajectoryData = await trajMgr.latestTrajectory({
      request: 'trajectory',
      param: {
        map_name: 'L1',
        duration: 1000,
        trim: true,
      },
    });

    trajectoryValue = trajectoryData.values[0];
    trajectoryConflict = trajectoryData.conflicts;
  });

  it('renders without crashing', async () => {
    const wrapper = await createWrapper(mapBound, trajectoryConflict, robots, [trajectoryValue]);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });
});
