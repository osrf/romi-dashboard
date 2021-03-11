import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrawerHeader from '../drawer-header';

describe('Drawer header', () => {
  test('Renders correctly', () => {
    const root = render(
      <DrawerHeader
        handleCloseButton={() => jest.fn()}
        handleBackButton={() => jest.fn()}
        title={'Test'}
      />,
    );
    expect(root.getByText('Test')).toBeDefined();
    expect(root.getByTestId('backDrawerButton')).toBeDefined();
    expect(root.getByTestId('closeDrawerButton')).toBeDefined();
  });

  test('Renders without back button if there is no handler', () => {
    const root = render(<DrawerHeader handleCloseButton={() => jest.fn()} title={'Test'} />);
    expect(root.queryByTestId('backDrawerButton')).toBeFalsy();
  });

  test('Click on close button fires an event correctly', () => {
    let clicked = false;
    const root = render(<DrawerHeader handleCloseButton={() => (clicked = true)} title={'Test'} />);
    const closeButton = root.getByTestId('closeDrawerButton');
    userEvent.click(closeButton);

    expect(clicked).toBe(true);
  });

  test('Click on back button fires an event correctly', () => {
    let clicked = false;
    const root = render(
      <DrawerHeader
        handleCloseButton={() => jest.fn()}
        handleBackButton={() => (clicked = true)}
        title={'Test'}
      />,
    );

    const backButton = root.getByTestId('backDrawerButton');
    userEvent.click(backButton);

    expect(clicked).toBe(true);
  });
});
