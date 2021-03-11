import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { materialTableIcons } from '..';

it('smoke tests', () => {
  for (const Icon of Object.values(materialTableIcons)) {
    render(<Icon />);
    cleanup();
  }
});
