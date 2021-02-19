import * as RomiCore from '@osrf/romi-js-core-interfaces';

export default function fakeTaskSummary(): Record<string, RomiCore.TaskSummary> {
  return {
    'af8faee9-84ca-41ea-8bb6-8493cc9f824c': {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 1,
      status:
        'Moving [tinyRobot/tinyRobot1]: ( 9.81228 -6.98942 -3.12904) -> ( 6.26403 -3.51569  1.16864) | Remaining phases: 1 | Remaining phases: 6',
      submission_time: { sec: 0, nanosec: 0 },
      task_id: 'af8faee9-84ca-41ea-8bb6-8493cc9f824c',
    },
    'am8faee9-84ca-41ea-8bb6-8493cc9f8249': {
      end_time: { sec: 0, nanosec: 0 },
      start_time: { sec: 0, nanosec: 0 },
      state: 0,
      status:
        'Moving [tinyRobot/tinyRobot2]: ( 9.81228 -6.98942 -3.12904) -> ( 6.26403 -3.51569  1.16864) | Remaining phases: 1 | Remaining phases: 6',
      submission_time: { sec: 0, nanosec: 0 },
      task_id: 'am8faee9-84ca-41ea-8bb6-8493cc9f8249',
    },
  };
}
