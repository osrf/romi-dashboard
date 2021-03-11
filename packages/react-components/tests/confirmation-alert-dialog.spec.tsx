import { render } from '@testing-library/react';
import React from 'react';
import { ConfirmationAlertDialog } from '../lib';

it('smoke test', () => {
  render(<ConfirmationAlertDialog open={true} />);
});
