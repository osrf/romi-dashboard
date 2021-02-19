import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { LogManagement } from '../../lib';

const getLogLabels = () => [
  { label: 'Web Server', value: 'web-server' },
  { label: 'RMF core', value: 'rmf-core' },
];

const getLogs = () => {
  const rows = [];
  for (let i = 0; i < 200; i++) {
    rows.push({
      message: 'Test' + i,
      level: 'WARN',
      timestamp: new Date('Mon Jan  1 00:00:02 UTC 2001').toISOString(),
    });
  }
  return rows;
};

const getLogsPromise = async () => await getLogs();
const getLabelsPromise = async () => await getLogLabels();

it('smoke test', async () => {
  // Added the waitFor because this component is updating a state inside a useEffect.
  await waitFor(() => {
    render(<LogManagement getLabels={getLabelsPromise} getLogs={getLogsPromise} />);
  });
});
