import { render } from '@testing-library/react';
import React from 'react';
import Dashboard from '../dashboard';

// react-leaflet doesn't work well in jsdom.
jest.mock('./../../schedule-visualizer', () => () => null);

it('renders without crashing', async () => {
  URL.createObjectURL = jest.fn();

  const root = render(<Dashboard />);
  root.unmount();
  (URL.createObjectURL as jest.Mock).mockReset();
});
