import { render } from '@testing-library/react';
import React from 'react';
import Dashboard from '../dashboard';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from 'react-components';

// react-leaflet doesn't work well in jsdom.
jest.mock('./../../schedule-visualizer', () => () => null);

it('renders without crashing', async () => {
  URL.createObjectURL = jest.fn();

  const root = render(
    <ThemeProvider theme={lightTheme}>
      <Dashboard />
    </ThemeProvider>,
  );
  root.unmount();
  (URL.createObjectURL as jest.Mock).mockReset();
});
