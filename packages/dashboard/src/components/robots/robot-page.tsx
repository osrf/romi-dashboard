/* istanbul ignore file */

import { makeStyles } from '@material-ui/core';
import React from 'react';
import { RobotPanel, VerboseRobot } from 'react-components';
import { RmfIngressContext } from '../rmf-app';

const useStyles = makeStyles((theme) => ({
  robotPanel: {
    padding: `${theme.spacing(4)}px`,
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
}));

export function RobotPage() {
  const classes = useStyles();
  const { fleetsApi } = React.useContext(RmfIngressContext) || {};

  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [verboseRobots, setVerboseRobots] = React.useState<VerboseRobot[]>([]);
  const fetchVerboseRobots = React.useCallback(async () => {
    if (!fleetsApi) {
      setTotalCount(0);
      return [];
    }
    const resp = await fleetsApi?.getRobotsFleetsRobotsGet(
      undefined,
      undefined,
      10,
      page * 10,
      'fleet_name,robot_name',
    );
    setTotalCount(resp.data.total_count);
    setVerboseRobots(resp.data.items);
    return resp.data.items;
  }, [fleetsApi, page]);

  React.useEffect(() => {
    fetchVerboseRobots();
  }, [fetchVerboseRobots]);

  return (
    <RobotPanel
      className={classes.robotPanel}
      fetchVerboseRobots={fetchVerboseRobots}
      paginationOptions={{
        count: totalCount,
        rowsPerPage: 10,
        rowsPerPageOptions: [10],
        page,
        onChangePage: (_ev, newPage) => setPage(newPage),
      }}
      verboseRobots={verboseRobots}
    />
  );
}
