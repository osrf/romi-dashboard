import React from 'react';
import { SystemSummaryItemState, ItemSummary } from '../../lib';
import { itemSummary } from './test.utils';
import { render } from '@testing-library/react';

test('smoke test', () => {
  render(<SystemSummaryItemState itemSummary={itemSummary} onClick={jest.fn()} />);
});

test('idle and charging panels to be rendered when idle and charging fields are present', () => {
  const itemSummaryOptionalFields: ItemSummary = {
    ...itemSummary,
    robotSummary: { operational: 0, outOfOrder: 0, idle: 0, charging: 0 },
    item: 'Robots',
  };
  const root = render(
    <SystemSummaryItemState itemSummary={itemSummaryOptionalFields} onClick={jest.fn()} />,
  );
  expect(root.queryByText('Idle')).toBeTruthy();
  expect(root.queryByText('Charging')).toBeTruthy();
});
