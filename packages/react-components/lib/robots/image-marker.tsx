import React from 'react';
import { ColorContext } from '../color-manager';
import { uniqueId } from '../css-utils';
import { BaseMarkerProps } from './base-marker';

/**
 *
 * @param color MUST be in hex notation without alpha channel. e.g. #123456
 */
function makeGradientShadow(
  color: string,
): React.FunctionComponent<React.SVGProps<SVGRadialGradientElement>> {
  return (props: React.SVGProps<SVGRadialGradientElement>) => (
    <radialGradient {...props}>
      <stop offset="0%" stopColor={`${color}80`} />
      <stop offset="70%" stopColor={`${color}40`} />
      <stop offset="90%" stopColor={`${color}10`} />
      <stop offset="100%" stopColor={`${color}00`} />
    </radialGradient>
  );
}

export interface ImageMarkerProps extends BaseMarkerProps {
  iconPath: string;
  onError?: React.EventHandler<React.SyntheticEvent<SVGImageElement, Event>>;
}

export const ImageMarker = (props: ImageMarkerProps): JSX.Element | null => {
  const { iconPath, footprint, variant, onError } = props;

  // The default icon uses footprint as the radius, so we * 2 here because the width/height
  // is in a square. With the double size of the footprint, we achieved a similar
  // size to the robot default svg icon.
  const [imgIconWidth, imgIconHeight] = React.useMemo(() => [footprint * 2, footprint * 2], [
    footprint,
  ]);
  const colorManager = React.useContext(ColorContext);

  const componentId = React.useMemo(uniqueId, []);
  const shadowId = React.useMemo(() => `RobotImageIcon-${componentId}-shadow`, [componentId]);
  const conflictShadowId = React.useMemo(() => `RobotImageIcon-${componentId}-shadow-conflict`, [
    componentId,
  ]);

  const Shadow = React.useMemo(() => makeGradientShadow('#000000'), []);
  const ShadowConflict = React.useMemo(() => makeGradientShadow(colorManager.conflictHighlight), [
    colorManager.conflictHighlight,
  ]);

  return iconPath ? (
    <g>
      <defs>
        <Shadow id={shadowId} />
        <ShadowConflict id={conflictShadowId} />
      </defs>
      <circle
        r={footprint * 1.3}
        fill={variant === 'inConflict' ? `url(#${conflictShadowId})` : `url(#${shadowId})`}
      />
      <image
        href={iconPath}
        width={imgIconWidth}
        height={imgIconHeight}
        x={-footprint}
        y={-footprint}
        onError={onError}
      />
    </g>
  ) : null;
};

export default ImageMarker;
