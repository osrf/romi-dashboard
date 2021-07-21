import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TransferList } from './transfer-list';

describe('TransferList', () => {
  let left: string[];
  let right: string[];

  beforeEach(() => {
    left = ['one', 'two'];
    right = ['three', 'four'];
  });

  it('renders left and right items', () => {
    const root = render(<TransferList leftItems={left} rightItems={right} />);
    left.forEach((i) => root.getByText(i));
    right.forEach((i) => root.getByText(i));
  });

  it('renders left and right titles', () => {
    const root = render(
      <TransferList leftItems={left} rightItems={right} leftTitle="left" rightTitle="right" />,
    );
    root.getByText('left');
    root.getByText('right');
  });

  it('transfers correct items', () => {
    const spy = jasmine.createSpy();
    const root = render(<TransferList leftItems={left} rightItems={right} onTransfer={spy} />);
    userEvent.click(root.getByText('one'));
    userEvent.click(root.getByLabelText('move selected right', { selector: 'button' }));
    const newLeft: string[] = spy.calls.mostRecent().args[0];
    const newRight: string[] = spy.calls.mostRecent().args[1];
    expect(newLeft).toHaveSize(1);
    expect(newLeft).not.toContain('one');
    expect(newRight).toHaveSize(3);
    expect(newRight).toContain('one');
  });
});
