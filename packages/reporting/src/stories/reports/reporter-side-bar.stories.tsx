import React from 'react';
import { LogManagement } from 'react-components';
import { ReportDashboard } from '../../components/report-dashboard';
import { Reports } from '../../components/report-list';
import { buildReportMenuStructure } from '../../components/reporter-side-bar-structure';

export default {
  title: 'Reports',
  component: ReportDashboard,
};

const getLogLabels = () => [
  { label: 'Web Server', value: 'web-server' },
  { label: 'RMF core', value: 'rmf-core' },
];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const getLogs = () => {
  const rows = [];
  for (let i = 0; i < 500; i++) {
    rows.push({
      message: 'Test' + i,
      level: 'Debug',
      created: randomDate(new Date(2012, 0, 1), new Date()).toISOString(),
      container: { id: 1, name: 'container_test' },
    });
  }
  return rows;
};

const getLogsPromise = async () => getLogs();
const getLabelsPromise = async () => getLogLabels();

const ReportContainer: Record<string, React.ReactElement> = {
  [Reports.queryAllLogs]: <LogManagement getLogs={getLogsPromise} getLabels={getLabelsPromise} />,
  [Reports.showChargerStateReport]: <h1>Still not implemented</h1>,
  [Reports.showDoorStateReport]: <h1>Still not implemented</h1>,
  [Reports.showLiftStateReport]: <h1>Still not implemented</h1>,
  [Reports.showNegotiationsReport]: <h1>Still not implemented</h1>,
  [Reports.showRobotStateReport]: <h1>Still not implemented</h1>,
  [Reports.showRobotMotionPlansReport]: <h1>Still not implemented</h1>,
  [Reports.showRobotActionReport]: <h1>Still not implemented</h1>,
  [Reports.showTasksReport]: <h1>Still not implemented</h1>,
  [Reports.showUserActionsReport]: <h1>Still not implemented</h1>,
  [Reports.showLoginsReport]: <h1>Still not implemented</h1>,
  [Reports.showLogoutsReport]: <h1>Still not implemented</h1>,
  [Reports.showLoginFailuresReport]: <h1>Still not implemented</h1>,
  [Reports.showWorkCellStatesReport]: <h1>Still not implemented</h1>,
};

export const StaticReportsView = () => (
  <ReportDashboard
    buildMenuReportStructure={buildReportMenuStructure}
    reportContainer={ReportContainer}
  />
);
