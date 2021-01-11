//import RGL, { WidthProvider } from 'react-grid-layout';
const ReactGridLayout = require('react-grid-layout');
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import './mega-grid.css';

import React, { Component } from 'react';

export class MegaGrid extends React.Component {
  render() {
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
      { i: 'b', x: 1, y: 1, w: 3, h: 2, minW: 2, maxW: 4 },
      { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ];
    return (
      <div className="container">
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          compactType={null}
        >
          <div key="a">
            <span className="text">A is not draggable</span>
          </div>
          <div key="b">
            <span className="text">B is draggable and resizable</span>
          </div>
          <div key="c">
            <span className="text">C is draggable and resizable</span>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}
