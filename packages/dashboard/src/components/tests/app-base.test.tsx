import { ThemeProvider } from '@material-ui/core';
import { waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { lightTheme } from 'react-components';
import { AppBase } from '../app-base';
import { AppControllerContext } from '../app-contexts';
import { renderAct } from './test-utils';

test('can show and hide settings', async () => {
  const TestComponent = () => {
    const appController = React.useContext(AppControllerContext);
    return (
      <>
        <button onClick={() => appController.showSettings(true)}>Show Settings</button>
        <button onClick={() => appController.showSettings(false)}>Hide Settings</button>
      </>
    );
  };

  const root = await renderAct(
    <ThemeProvider theme={lightTheme}>
      <AppBase appbarProps={{ tabValue: 'building' }}>
        <TestComponent />
      </AppBase>
    </ThemeProvider>,
  );

  userEvent.click(root.getByText('Show Settings'));
  expect(root.getByText('Settings')).toBeTruthy();

  userEvent.click(root.getByText('Hide Settings'));
  await waitForElementToBeRemoved(root.getByText('Settings'));
  expect(root.queryByText('Settings')).toBeFalsy();
});

test('can toggle settings', async () => {
  const TestComponent = () => {
    const appController = React.useContext(AppControllerContext);
    return (
      <>
        <button onClick={() => appController.toggleSettings()}>Toggle Settings</button>
      </>
    );
  };

  const root = await renderAct(
    <ThemeProvider theme={lightTheme}>
      <AppBase appbarProps={{ tabValue: 'building' }}>
        <TestComponent />
      </AppBase>
    </ThemeProvider>,
  );

  userEvent.click(root.getByText('Toggle Settings'));
  expect(root.getByText('Settings')).toBeTruthy();

  userEvent.click(root.getByText('Toggle Settings'));
  await waitForElementToBeRemoved(root.getByText('Settings'));
  expect(root.queryByText('Settings')).toBeFalsy();
});

test('can show and hide settings', async () => {
  const TestComponent = () => {
    const appController = React.useContext(AppControllerContext);
    return (
      <>
        <button onClick={() => appController.showHelp(true)}>Show Help</button>
        <button onClick={() => appController.showHelp(false)}>Hide Help</button>
      </>
    );
  };

  const root = await renderAct(
    <ThemeProvider theme={lightTheme}>
      <AppBase appbarProps={{ tabValue: 'building' }}>
        <TestComponent />
      </AppBase>
    </ThemeProvider>,
  );

  userEvent.click(root.getByText('Show Help'));
  expect(root.getByText('Help')).toBeTruthy();

  userEvent.click(root.getByText('Hide Help'));
  await waitForElementToBeRemoved(root.getByText('Help'));
  expect(root.queryByText('Help')).toBeFalsy();
});

test('can toggle help', async () => {
  const TestComponent = () => {
    const appController = React.useContext(AppControllerContext);
    return (
      <>
        <button onClick={() => appController.toggleHelp()}>Toggle Help</button>
      </>
    );
  };

  const root = await renderAct(
    <ThemeProvider theme={lightTheme}>
      <AppBase appbarProps={{ tabValue: 'building' }}>
        <TestComponent />
      </AppBase>
    </ThemeProvider>,
  );

  userEvent.click(root.getByText('Toggle Help'));
  expect(root.getByText('Help')).toBeTruthy();

  userEvent.click(root.getByText('Toggle Help'));
  await waitForElementToBeRemoved(root.getByText('Help'));
  expect(root.queryByText('Help')).toBeFalsy();
});

test('can show and hide hotkeys dialog', async () => {
  const TestComponent = () => {
    const appController = React.useContext(AppControllerContext);
    return (
      <>
        <button onClick={() => appController.showHotkeysDialog(true)}>Show Hotkeys</button>
        <button onClick={() => appController.showHotkeysDialog(false)}>Hide Hotkeys</button>
      </>
    );
  };

  const root = await renderAct(
    <ThemeProvider theme={lightTheme}>
      <AppBase appbarProps={{ tabValue: 'building' }}>
        <TestComponent />
      </AppBase>
    </ThemeProvider>,
  );

  userEvent.click(root.getByText('Show Hotkeys'));
  expect(root.getByText('Hotkeys')).toBeTruthy();

  userEvent.click(root.getByText('Hide Hotkeys'));
  expect(root.queryByText('Hotkeys')).toBeFalsy();
});

test('can toggle hotkeys dialog', async () => {
  const TestComponent = () => {
    const appController = React.useContext(AppControllerContext);
    return (
      <>
        <button onClick={() => appController.toggleHotkeysDialog()}>Toggle Hotkeys</button>
      </>
    );
  };

  const root = await renderAct(
    <ThemeProvider theme={lightTheme}>
      <AppBase appbarProps={{ tabValue: 'building' }}>
        <TestComponent />
      </AppBase>
    </ThemeProvider>,
  );

  userEvent.click(root.getByText('Toggle Hotkeys'));
  expect(root.getByText('Hotkeys')).toBeTruthy();

  userEvent.click(root.getByText('Toggle Hotkeys'));
  expect(root.queryByText('Hotkeys')).toBeFalsy();
});
