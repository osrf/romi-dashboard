/* istanbul ignore file */

import { makeStyles } from '@material-ui/core';
import React from 'react';
import { RobotPanel, RobotPanelProps } from 'react-components';
import { RmfIngressContext } from '../rmf-app';
import { useAutoRefresh } from './auto-refresh';

const useStyles = makeStyles((theme) => ({
  robotPanel: {
    margin: `${theme.spacing(4)}px auto`,
    width: '100%',
    height: '100%',
    maxWidth: 1600,
  },
}));

export function RobotPage() {
  const classes = useStyles();
  const { fleetsApi, sioClient } = React.useContext(RmfIngressContext) || {};

  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [autoRefreshState, autoRefreshDispatcher] = useAutoRefresh(sioClient);

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
    return resp.data.items;
  }, [fleetsApi, page]);

  const handleRefresh = React.useCallback<Required<RobotPanelProps>['onRefresh']>(async () => {
    const verboseRobots = await fetchVerboseRobots();
    autoRefreshDispatcher.setVerboseRobots(verboseRobots);
    return verboseRobots;
  }, [fetchVerboseRobots, autoRefreshDispatcher]);

  React.useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <RobotPanel
      className={classes.robotPanel}
      onRefresh={handleRefresh}
      onAutoRefresh={autoRefreshDispatcher.setEnabled}
      paginationOptions={{
        count: totalCount,
        rowsPerPage: 10,
        rowsPerPageOptions: [10],
        page,
        onChangePage: (_ev, newPage) => setPage(newPage),
      }}
      verboseRobots={autoRefreshState.verboseRobots}
    />
  );
}
