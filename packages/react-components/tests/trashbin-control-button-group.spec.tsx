import React from 'react';
import { TrashBinControlButtonGroup } from '../lib';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('It disabled buttons', () => {
  const root = render(
    <TrashBinControlButtonGroup
      disableClear={true}
      disableReset={true}
      disableRestore={true}
      disableSave={true}
    />,
  );
  expect(
    root.container.querySelector('button#clear-button')?.hasAttribute('disabled'),
  ).toBeTruthy();
  expect(
    root.container.querySelector('button#reset-button')?.hasAttribute('disabled'),
  ).toBeTruthy();
  expect(
    root.container.querySelector('button#restore-button')?.hasAttribute('disabled'),
  ).toBeTruthy();
  expect(root.container.querySelector('button#save-button')?.hasAttribute('disabled')).toBeTruthy();
});

it('It executes callbacks correctly', () => {
  const fakeOnResetClick = jasmine.createSpy();
  const fakeOnClearClick = jasmine.createSpy();
  const fakeOnRestoreClick = jasmine.createSpy();
  const fakeOnSaveClick = jasmine.createSpy();

  const root = render(
    <TrashBinControlButtonGroup
      onResetClick={fakeOnResetClick}
      onClearClick={fakeOnClearClick}
      onRestoreClick={fakeOnRestoreClick}
      onSaveClick={fakeOnSaveClick}
    />,
  );

  userEvent.click(root.getByText('Clear'));
  userEvent.click(root.getByText('Reset'));
  userEvent.click(root.getByText('Restore'));
  userEvent.click(root.getByText('Save'));

  expect(fakeOnResetClick).toHaveBeenCalledTimes(1);
  expect(fakeOnClearClick).toHaveBeenCalledTimes(1);
  expect(fakeOnRestoreClick).toHaveBeenCalledTimes(1);
  expect(fakeOnSaveClick).toHaveBeenCalledTimes(1);
});

it('It hides buttons', () => {
  const root = render(
    <TrashBinControlButtonGroup
      showReset={false}
      showRestore={false}
      showSave={false}
      showClear={false}
    />,
  );
  expect(root.container.querySelector('button#clear-button')).toBeFalsy();
  expect(root.container.querySelector('button#reset-button')).toBeFalsy();
  expect(root.container.querySelector('button#restore-button')).toBeFalsy();
  expect(root.container.querySelector('button#save-button')).toBeFalsy();
});
