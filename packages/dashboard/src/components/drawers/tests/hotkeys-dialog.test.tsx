import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GlobalHotKeys, KeySequence } from 'react-hotkeys';
import HotKeysDialog from '../hotkeys-dialog';

describe('Hotkeys Dialog', () => {
  test('should render without crashing', async () => {
    const keyMap = {
      OPEN_COMMANDS: {
        name: 'Open Commands',
        sequences: [{ sequence: 'shift+c', action: 'keypress' }],
      } as KeySequence,
    };

    const handlers = {
      OPEN_COMMANDS: () => jest.fn(),
    };

    await waitFor(() => {
      const root = render(
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
          <HotKeysDialog handleClose={() => jest.fn()} open={true} />
        </GlobalHotKeys>,
      );
      expect(root.baseElement.childNodes).toBeDefined();
      expect(root.getAllByTestId('hotkeyDetail').length).toBe(Object.keys(keyMap).length);
      root.unmount();
    });
  });
});
