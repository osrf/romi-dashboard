import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loadSettings } from '../../../settings';
import { SettingsContext } from '../../app-contexts';
import SettingsDrawer from '../../drawers/settings-drawer';

describe('Settings Drawer', () => {
  let settings = loadSettings();
  let onSettingsChange: jest.Mock;
  let handleCloseButton: jest.Mock;

  beforeEach(() => {
    onSettingsChange = jest.fn();
    handleCloseButton = jest.fn();
  });

  it('should render correctly', () => {
    const root = render(
      <SettingsContext.Provider value={settings}>
        <SettingsDrawer
          handleCloseButton={handleCloseButton}
          settings={settings}
          onSettingsChange={onSettingsChange}
          open={true}
        />
      </SettingsContext.Provider>,
    );
    root.unmount();
  });

  it('should call onSettingsChange function when handleTrajectoryAnimationChange is called', () => {
    const root = render(
      <SettingsContext.Provider value={settings}>
        <SettingsDrawer
          handleCloseButton={handleCloseButton}
          settings={settings}
          onSettingsChange={onSettingsChange}
          open={true}
        />
      </SettingsContext.Provider>,
    );
    const input = root.getByLabelText('None');
    userEvent.click(input);
    expect(onSettingsChange).toHaveBeenCalledTimes(1);
  });

  it('should call handleCloseButton function when closeIcon button is clicked', () => {
    const root = render(
      <SettingsContext.Provider value={settings}>
        <SettingsDrawer
          settings={settings}
          onSettingsChange={(newSettings) => onSettingsChange(newSettings)}
          open={true}
          handleCloseButton={handleCloseButton}
        />
      </SettingsContext.Provider>,
    );
    const closeButton = root.getByRole('button');
    userEvent.click(closeButton);
    expect(handleCloseButton).toHaveBeenCalledTimes(1);
  });
});
