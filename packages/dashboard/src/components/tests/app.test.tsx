import { createMount } from '@material-ui/core/test-utils';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../app';

const mount = createMount();

// react-leaflet doesn't work well in jsdom.
jest.mock('./../schedule-visualizer', () => () => null);

it('renders correctly', async () => {
  await act(async () => {
    expect(() => mount(<App />)).not.toThrow();
  });
});
