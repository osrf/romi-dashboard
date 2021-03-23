import { Mosaic, MosaicWindow, MosaicBranch } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import { makeStyles } from '@material-ui/core';
import Debug from 'debug';
import React from 'react';
import BuildingMapWindow from './building-map-window';

const debug = Debug('LayoutManager');

const useStyles = makeStyles({
  layoutManager: {
    width: '100%',
    height: '100%',
    margin: '0px',
    padding: '0px',
  },
});

export default function LayoutManager(_props: {}): React.ReactElement {
  debug('render');

  function create_tile(id: string, path: MosaicBranch[]): JSX.Element {
    if (id === 'map_2d') return <BuildingMapWindow path={path} />;
    else {
      return (
        <MosaicWindow<string>
          path={path}
          className="layout-manager-theme"
          title={id}
          toolbarControls={[]}
        >
          <div>panel id: {id}</div>
        </MosaicWindow>
      );
    }
  }

  const classes = useStyles();
  return (
    <div className={classes.layoutManager}>
      <Mosaic<string>
        renderTile={(id, path) => create_tile(id, path)}
        resize={{ minimumPaneSizePercentage: 5 }}
        initialValue={{
          direction: 'row',
          first: 'map_2d',
          second: {
            direction: 'column',
            first: 'placeholder_A',
            second: 'placeholder_B',
            splitPercentage: 40,
          },
          splitPercentage: 70,
        }}
      />
    </div>
  );
}
