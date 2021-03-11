import { render } from '@testing-library/react';
import React from 'react';
import { StatusLabel } from '../lib';

describe('variant === unknown', () => {
  it('text is "N/A" regardless of the prop', () => {
    const root = render(<StatusLabel text="test" variant="unknown" />);
    expect(root.queryByText('N/A')).toBeTruthy();
  });

  it('border color is different for unknown variant', () => {
    const normal = render(<StatusLabel data-testid="normal" />);
    const unknown = render(<StatusLabel data-testid="unknown" variant="unknown" />);
    const normalColor = window.getComputedStyle(normal.getByTestId('normal')).borderColor;
    const unknownColor = window.getComputedStyle(unknown.getByTestId('unknown')).borderColor;
    expect(normalColor).not.toBe(unknownColor);
  });
});
