import React, { Component } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

class MegaGrid extends React.Component {
  render() {
    return <h1>foo5</h1>;
  }
}

export default MegaGrid;

// layout is an array of objects, see the demo for more complete usage
/*
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
      { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
      { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ];
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </GridLayout>
    );
    */
//}
