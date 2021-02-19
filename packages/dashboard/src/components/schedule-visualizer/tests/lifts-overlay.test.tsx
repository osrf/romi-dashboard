import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { render } from '@testing-library/react';
import L from 'leaflet';
import React from 'react';
import { Map as LMap } from 'react-leaflet';
import LiftsOverlay, { getLiftModeVariant } from '../lift-overlay';
import officeMap from './building-map-office';

function getLift() {
  return officeMap.lifts;
}

describe('Lift render', () => {
  test('smoke test', () => {
    const lifts = getLift();
    const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
    render(
      <LMap>
        <LiftsOverlay currentFloor={'L1'} bounds={bounds} lifts={lifts} />
      </LMap>,
    );
  });
});

describe('picks style in correct order', () => {
  test('Returns unknown if liftStateMode and liftStateMode are undefined ', () => {
    expect(getLiftModeVariant('L1')).toBe('unknown');
  });

  test('picks emergency and fire mode if the lift is on the current floor and on a different floor', () => {
    const modeFire = getLiftModeVariant('L1', RomiCore.LiftState.MODE_FIRE, 'L1');
    expect(modeFire).toBe('fire');

    const modeEmergency = getLiftModeVariant('L1', RomiCore.LiftState.MODE_EMERGENCY, 'L2');
    expect(modeEmergency).toBe('emergency');
  });

  test('picks `offline` mode if the lift is on the current floor and a different floor', () => {
    const modeOfflineOnFloor = getLiftModeVariant('L1', RomiCore.LiftState.MODE_OFFLINE, 'L1');
    expect(modeOfflineOnFloor).toBe('offLine');

    const modeOfflineOnAnotherFloor = getLiftModeVariant(
      'L1',
      RomiCore.LiftState.MODE_OFFLINE,
      'L2',
    );
    expect(modeOfflineOnAnotherFloor).toBe('offLine');
  });

  test('picks `moving` mode if the lift is on a different floor', () => {
    const modeMovingAgv = getLiftModeVariant('L1', RomiCore.LiftState.MODE_AGV, 'L2');
    expect(modeMovingAgv).toBe('moving');
    const modeMovingHuman = getLiftModeVariant('L1', RomiCore.LiftState.MODE_HUMAN, 'L2');
    expect(modeMovingHuman).toBe('moving');
  });

  test('picks AGV and HUMAN mode if the lift is on the same floor ', () => {
    const modeAgv = getLiftModeVariant('L1', RomiCore.LiftState.MODE_AGV, 'L1');
    const modeHuman = getLiftModeVariant('L1', RomiCore.LiftState.MODE_HUMAN, 'L1');
    expect(modeAgv).toBe('onCurrentFloor');
    expect(modeHuman).toBe('human');
  });
});
