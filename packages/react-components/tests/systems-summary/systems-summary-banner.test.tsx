import React from 'react';
import { SystemSummaryBanner } from '../../lib';
import { render } from '@testing-library/react';

test('should contain noError class if isError is false', () => {
  const root = render(<SystemSummaryBanner isError={false} />);
  expect(root.container.querySelector('h6')?.classList[2].includes('makeStyles-noError')).toEqual(
    true,
  );
});

test('should contain error class if isError is true', () => {
  const root = render(<SystemSummaryBanner isError={true} />);
  expect(root.container.querySelector('h6')?.classList[2].includes('makeStyles-error')).toEqual(
    true,
  );
});
