import { render } from '@testing-library/react';
import React from 'react';
import { Loading } from './loading';

describe('Loading', () => {
  it('renders children when not loading', () => {
    const root = render(<Loading loading={false}>Test</Loading>);
    root.getByText('Test');
  });

  it('hides children when loading and hideChildren is true', () => {
    const root = render(
      <Loading loading hideChildren>
        Test
      </Loading>,
    );
    const test = root.getByText('Test');
    expect(test.style.visibility).toBe('hidden');
  });

  it('does not hide children when loading and hideChildren is false', () => {
    const root = render(
      <Loading loading hideChildren={false}>
        Test
      </Loading>,
    );
    const test = root.getByText('Test');
    expect(test.style.visibility).toBe('visible');
  });
});
