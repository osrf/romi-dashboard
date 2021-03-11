import { render } from '@testing-library/react';
import React from 'react';
import MainMenu from '../main-menu';

it('renders without crashing', () => {
  const root = render(<MainMenu pushView={jest.fn()} />);
  root.unmount();
});
