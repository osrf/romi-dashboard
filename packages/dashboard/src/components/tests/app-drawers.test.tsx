import { render } from '@testing-library/react';
import React from 'react';
import { defaultSettings } from '../../settings';
import { AppDrawers } from '../app-drawers';

describe('app-drawers', () => {
  test('setting`s drawer is shown', () => {
    const root = render(
      <AppDrawers
        settings={defaultSettings()}
        showSettings={true}
        showHelp={false}
        showHotkeysDialog={false}
      />,
    );
    expect(root.getByText('Settings')).toBeTruthy();
  });

  test('help`s drawer is shown', () => {
    const root = render(
      <AppDrawers
        settings={defaultSettings()}
        showSettings={false}
        showHelp={true}
        showHotkeysDialog={false}
      />,
    );
    expect(root.getByText('Help')).toBeTruthy();
  });

  test('hotkeys` drawer is shown', () => {
    const root = render(
      <AppDrawers
        settings={defaultSettings()}
        showSettings={false}
        showHelp={false}
        showHotkeysDialog={true}
      />,
    );
    expect(root.getByText('Hotkeys')).toBeTruthy();
  });
});
