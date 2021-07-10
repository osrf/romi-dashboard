import React from 'react';
import { Story, Meta } from '@storybook/react';
import { LogManagement, LogTable, SearchLogForm } from '../lib';

export default {
  title: 'Logging',
  argTypes: {},
} as Meta;

const getLogLabels = () => [
  { label: 'Web Server', value: 'web-server' },
  { label: 'RMF core', value: 'rmf-core' },
];

const timestamp = new Date('Mon Jan  1 00:00:02 UTC 2001').toISOString();

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
      container_name: 'container_test',
    });
  }
  return rows;
};

const getLogsPromise = async () => getLogs();
const getLabelsPromise = async () => getLogLabels();

export const LogManagementExample: Story = (args) => (
  // add a background to visualize different theme colors properly
  <div style={{ backgroundColor: '#A8A8A8', padding: '1rem' }}>
    <LogManagement getLogs={getLogsPromise} getLabels={getLabelsPromise} {...args} />
  </div>
);

export const SimpleSearchLogForm: Story = (args) => (
  // add a background to visualize different theme colors properly
  <div style={{ backgroundColor: '#A8A8A8', padding: '1rem' }}>
    <SearchLogForm logLabelValues={getLogLabels()} {...args} />
  </div>
);

export const SimpleLogTable: Story = (args) => {
  const logs = getLogs();
  logs.unshift({
    message: `
    npm ERR! code ELIFECYCLE
    npm ERR! errno 1
    npm ERR! react-components@0.0.1 build: 'npm run lint && tsc --build'
    npm ERR! Exit status 1
    npm ERR! 
    npm ERR! Failed at the react-components@0.0.1 build script.
    npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
    
    npm ERR! A complete log of this run can be found in:
    npm ERR!     /home/ekumen/.npm/_logs/2021-01-18T21_20_07_480Z-debug.log`,
    level: 'Error',
    created: timestamp,
    container_name: 'container_test',
  });
  logs.unshift({
    message: `long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long msg`,
    level: 'Debug',
    created: timestamp,
    container_name: 'container_test',
  });

  return <LogTable rows={logs} {...args} />;
};
