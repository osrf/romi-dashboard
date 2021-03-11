import React from 'react';
import { render } from '@testing-library/react';
import HelpDrawer from '../help-drawer';

test('Renders correctly', () => {
  const root = render(
    <HelpDrawer
      handleCloseButton={() => jest.fn()}
      setShowHotkeyDialog={() => jest.fn()}
      showTour={() => jest.fn()}
    />,
  );
  root.unmount();
});
