import { render } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FakeAuthenticator from '../../mock/fake-authenticator';
import { AppController, AppControllerContext } from '../app-contexts';
import AppBar from '../appbar';
import { AuthenticatorContext, UserContext } from '../auth/contexts';
import { makeMockAppController } from './mock-app-controller';

describe('AppBar', () => {
  let appController: AppController;
  const Base = (props: React.PropsWithChildren<{}>) => {
    return (
      <AppControllerContext.Provider value={appController}>
        {props.children}
      </AppControllerContext.Provider>
    );
  };

  beforeEach(() => {
    appController = makeMockAppController();
  });

  test('show settings when settings button is clicked', () => {
    const root = render(
      <Base>
        <AppBar />
      </Base>,
    );
    act(() => {
      const elements = root.getAllByTestId('setting-tooltip-tooltip');
      for (let element in elements) {
        userEvent.click(elements[element]);
      }
    });
    expect(appController.showSettings).toBeCalledTimes(1);
  });

  test('shows help when help button is clicked', () => {
    const root = render(
      <Base>
        <AppBar />
      </Base>,
    );
    act(() => {
      const elements = root.getAllByTestId('help-tooltip-tooltip');
      for (let element in elements) {
        userEvent.click(elements[element]);
      }
    });
    expect(appController.showHelp).toBeCalledTimes(1);
  });

  test('renders tooltips when it is enabled', async () => {
    const root = render(
      <Base>
        <AppBar />
      </Base>,
    );
    userEvent.hover(root.getByTestId('help-tooltip-tooltip'));
    expect(await root.findByText('Help tools and resources')).toBeTruthy();

    userEvent.hover(root.getByTestId('setting-tooltip-tooltip'));
    expect(await root.findByText('Define dashboard trajectory settings')).toBeTruthy();
  });

  test('user button is shown when there is an authenticated user', () => {
    const root = render(
      <Base>
        <UserContext.Provider value={{ username: 'test' }}>
          <AppBar />
        </UserContext.Provider>
      </Base>,
    );
    expect(root.getByLabelText('user-btn')).toBeTruthy();
  });

  test('logout is triggered when logout button is clicked', () => {
    const authenticator = new FakeAuthenticator();
    const spy = jest.spyOn(authenticator, 'logout').mockImplementation(() => undefined as any);
    const root = render(
      <Base>
        <AuthenticatorContext.Provider value={authenticator}>
          <UserContext.Provider value={{ username: 'test' }}>
            <AppBar />
          </UserContext.Provider>
        </AuthenticatorContext.Provider>
      </Base>,
    );
    userEvent.click(root.getByLabelText('user-btn'));
    userEvent.click(root.getByText('Logout'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
