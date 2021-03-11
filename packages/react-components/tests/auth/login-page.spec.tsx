import { render } from '@testing-library/react';
import React from 'react';
import { LoginPage } from '../../lib';

it('smoke test', () => {
  render(<LoginPage title="test" logo="" />);
});
