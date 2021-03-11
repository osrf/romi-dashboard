import * as RomiCore from '@osrf/romi-js-core-interfaces';
import * as L from 'leaflet';
import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { robotHash } from 'react-components';
import { Map as LMap } from 'react-leaflet';
import FakeTrajectoryManager from '../../../managers/__mocks__/robot-trajectory-manager';
import { Conflict, Trajectory } from '../../../managers/robot-trajectory-manager';
import { defaultSettings } from '../../../settings';
import { SettingsContext } from '../../app-contexts';
import RobotTrajectoriesOverlay from '../robot-trajectories-overlay';

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

  it('smoke test', async () => {
    const settings = defaultSettings();
    let root: RenderResult;
    await waitFor(() => {
      root = render(
        <LMap>
          <SettingsContext.Provider value={settings}>
            <RobotTrajectoriesOverlay
              bounds={mapBound}
              robots={robots}
              trajectories={[trajectoryValue]}
              conflicts={trajectoryConflict}
            />
          </SettingsContext.Provider>
        </LMap>,
      );
      root.unmount();
    });
  });
});
