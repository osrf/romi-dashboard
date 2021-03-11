import { render } from '@testing-library/react';
import React from 'react';
import { EmergencyAlarm } from '../emergency-alarm';

describe('Emergency alarm behavior', () => {
  let root: any;

  afterEach(() => {
    root.unmount();
  });

  test('Alarm renders correctly without crashing when is activated', () => {
    root = render(<EmergencyAlarm isActive={true}></EmergencyAlarm>);
  });

  test('Alarm icon is not displayed when is no activated', () => {
    root = render(<EmergencyAlarm isActive={null}></EmergencyAlarm>);
    expect(root.queryByRole('button')).toBeFalsy();
  });

  test('Alarm icon displays a red icon when is activated', () => {
    root = render(<EmergencyAlarm isActive={true}></EmergencyAlarm>);
    expect(root.queryByRole('button')).toBeTruthy();
  });
});
