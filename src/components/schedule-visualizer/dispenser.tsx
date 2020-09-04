import { makeStyles } from '@material-ui/core';
import React from 'react';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { DispenserResource, DispenserResourceManager } from '../../resource-manager-dispensers';
import SvgText from './svg-text';

export interface DispenserProps {
  dispenser: Required<DispenserResource>;
  dispenserHandler: DispenserResourceManager;
  dispenserState?: RomiCore.DispenserState;
  footprint: number;
  onClick?(e: React.MouseEvent<SVGGElement>, dispenser: RomiCore.DispenserState): void;
}

const Dispenser = React.memo(
  React.forwardRef(function(
    props: DispenserProps,
    ref: React.Ref<SVGGElement>,
  ): React.ReactElement {
    const { dispenser, footprint, dispenserState, dispenserHandler, onClick } = props;
    const classes = useStyles();
    const defaultIconPath = '/assets/move_to_inbox_black_192x192.png';
    const [iconPath, setIconPath] = React.useState(
      !!dispenserHandler && dispenser.guid
        ? dispenserHandler.getIconPath(dispenser.guid)
        : defaultIconPath,
    );
    return (
      <>
        <g
          ref={ref}
          className={`${classes.container}`}
          onClick={e => onClick && dispenserState && onClick(e, dispenserState)}
          transform={`translate(${dispenser.location.x} ${-dispenser.location.y})
        rotate(${-(dispenser.location.yaw * 180) / Math.PI})`}
        >
          <g transform={`translate(${-footprint} ${-footprint})`}>
            <image
              href={!!iconPath ? iconPath : defaultIconPath}
              height={footprint * 2}
              width={footprint * 2}
              onError={error => {
                setIconPath(defaultIconPath);
                console.error(
                  'An error occurred while loading the image. Using the default image.',
                  error,
                );
              }}
            />
          </g>
        </g>
        <SvgText
          id="dispenserName"
          x={dispenser.location.x}
          y={-dispenser.location.y}
          className={classes.dispenserText}
          text={dispenser.guid}
          targetWidth={footprint * 2.2}
        />
      </>
    );
  }),
);

export default Dispenser;

const useStyles = makeStyles(() => ({
  dispenserText: {
    dominantBaseline: 'central',
    textAnchor: 'middle',
    fontSize: '0.18px',
    fontWeight: 'bold',
    fill: 'white',
    /* 1 pixel black shadow to left, top, right and bottom */
    textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
    pointerEvents: 'none',
  },

  container: {
    pointerEvents: 'visible',
    cursor: 'pointer',
  },
}));
