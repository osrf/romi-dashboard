import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlarmDrawer from '../alarm-drawer';

describe('Alarm Drawer', () => {
  it('Renders correctly', async () => {
    let root: RenderResult;
    waitFor(() => {
      root = render(
        <AlarmDrawer
          handleCloseButton={() => jest.fn()}
          triggerCodeBlue={() => jest.fn()}
          triggerCodeRed={() => jest.fn()}
        />,
      );
      expect(root.queryByRole('button', { name: 'Code Blue' })).toBeTruthy();
      expect(root.queryByRole('button', { name: 'Code Red' })).toBeTruthy();
      root.unmount();
    });
  });

  it('Clicking the code red button opens the emergency alarm', () => {
    let root: RenderResult;
    waitFor(() => {
      root = render(
        <AlarmDrawer
          handleCloseButton={() => jest.fn()}
          triggerCodeBlue={() => jest.fn()}
          triggerCodeRed={() => jest.fn()}
        />,
      );
      const codeRedButton = root.getByRole('button', { name: 'Code Red' });
      userEvent.click(codeRedButton);
      expect(root.queryByRole('button', { name: 'Alarm Modal' })).toBeTruthy();
    });
  });
});
