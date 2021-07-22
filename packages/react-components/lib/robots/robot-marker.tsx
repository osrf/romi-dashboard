import { makeStyles, Tooltip } from '@material-ui/core';
import Debug from 'debug';
import React from 'react';
import { ColorContext, SvgText } from '..';
import { fromRmfCoords, fromRmfYaw } from '../geometry-utils';
import { BaseMarkerProps } from './base-marker';
import { DefaultMarker } from './default-marker';
import { ImageMarker } from './image-marker';
import { robotModeToString } from './utils';

const debug = Debug('Robots:RobotMarker');

const useStyles = makeStyles(() => ({
  text: {
    dominantBaseline: 'central',
    textAnchor: 'middle',
    fontSize: '0.18px',
    fontWeight: 'bold',
    fill: 'white',
    /* 1 pixel black shadow to left, top, right and bottom */
    textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  clickable: {
    pointerEvents: 'auto',
    cursor: 'pointer',
  },
}));

export interface RobotMarkerProps extends BaseMarkerProps {
  iconPath?: string;
}

/**
 * Contexts: ColorContext
 */
export const RobotMarker = React.forwardRef(
  (props: RobotMarkerProps, ref: React.Ref<SVGGElement>) => {
    // some props are not used but have to be declared to correctly set `otherProps`
    const {
      name,
      model,
      robotMode,
      x,
      y,
      yaw: rmfYaw,
      footprint,
      fleetName,
      iconPath,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variant,
      translate = true,
      onClick,
      ...otherProps
    } = props;
    debug(`render ${name}`);
    const [useImageMarker, setUseImageMarker] = React.useState(!!iconPath);
    const [robotColor, setRobotColor] = React.useState<string | undefined>(undefined);
    const colorManager = React.useContext(ColorContext);
    const classes = useStyles();
    const pos = fromRmfCoords([x, y]);
    const yaw = (fromRmfYaw(rmfYaw) / Math.PI) * 180;

    const translateTransform = translate ? `translate(${pos[0]} ${pos[1]})` : undefined;

    const isMounted = React.useRef(true);
    React.useEffect(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    React.useEffect(() => {
      if (useImageMarker) {
        return;
      }
      (async () => {
        const color = await colorManager.robotPrimaryColor(fleetName, name, model);
        isMounted.current && setRobotColor(color);
      })();
    }, [name, model, colorManager, fleetName, useImageMarker]);

    return (
      <Tooltip
        title={
          <React.Fragment>
            <div>Name - {name}</div>
            <div>State - {robotModeToString(robotMode)}</div>
          </React.Fragment>
        }
      >
        <g ref={ref} onClick={(ev) => onClick && onClick(ev, fleetName, name)} {...otherProps}>
          <g transform={translateTransform}>
            <g className={classes.clickable} aria-label={name} transform={`rotate(${yaw})`}>
              {useImageMarker && iconPath ? (
                <ImageMarker
                  {...props}
                  iconPath={iconPath}
                  onError={() => setUseImageMarker(false)}
                />
              ) : robotColor ? (
                <DefaultMarker color={robotColor} {...props} />
              ) : null}
            </g>
            <SvgText text={name} targetWidth={footprint * 1.9} className={classes.text} />
          </g>
        </g>
      </Tooltip>
    );
  },
);

export default RobotMarker;
