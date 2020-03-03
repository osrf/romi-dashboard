import React from 'react';
import ReactDOM from 'react-dom';
import DoorsPanel from '../doors-panel';
import buildingMap from './data/building-map';
import doorStates from './data/door-states';

ReactDOM.render(
  <DoorsPanel
    buildingMap={buildingMap}
    doorStates={doorStates}
    onOpenClick={door => {
      console.log(`${door.name} open clicked`);
    }}
    onCloseClick={door => {
      console.log(`${door.name} close clicked`);
    }}
  />,
  document.getElementById('root'),
);
