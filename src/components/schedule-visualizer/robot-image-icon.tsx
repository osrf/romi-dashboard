import { useTheme } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { RobotProps } from './robot';

type RobotImageIconProps = RobotProps & {
  iconPath: string;
  dispatchIconError: React.Dispatch<
    React.SetStateAction<{
      path: string | null;
      error: boolean;
    }>
  >;
};

const RobotImageIcon = React.forwardRef(function(
  props: RobotImageIconProps,
  ref: React.Ref<SVGGElement>,
): React.ReactElement {
  const {
    robot,
    footprint,
    iconPath,
    dispatchIconError,
    inConflict,
    colorManager,
    fleetName,
  } = props;

  const theme = useTheme();
  // The default icon uses footprint as the radius, so we * 2 here because the width/height
  // is in a square. With the double size of the footprint, we achieved a similar
  // size to the robot default svg icon.
  const [imgIconWidth, imgIconHeigth] = useMemo(() => [footprint * 2, footprint * 2], [footprint]);
  const [robotColor, setRobotColor] = useState<string | null>(() =>
    colorManager.robotColorFromCache(fleetName, robot.name),
  );

  React.useLayoutEffect(() => {
    if (robotColor) {
      return;
    }
    (async () => {
      await colorManager
        .robotPrimaryColor(fleetName, robot.name, robot.model, iconPath)
        .then(color => {
          if (color) setRobotColor(color);
        });
    })();
  }, [robot, robotColor, colorManager, iconPath, fleetName]);

  return (
    <>
      {!!iconPath && (
        <g transform={`translate(${-footprint} ${-footprint})`}>
          <filter id={`${robot.name}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation={footprint * 0.15}
              floodColor={inConflict ? theme.palette.error.main : theme.palette.common.black}
            />
          </filter>
          <image
            href={iconPath}
            height={imgIconHeigth}
            width={imgIconWidth}
            filter={`url(#${robot.name}-shadow)`}
            onError={error => {
              console.error(
                'An error occurred while loading the image. Using the default image.',
                error,
              );
              return dispatchIconError(previousVal => {
                return { ...previousVal, error: true };
              });
            }}
          />
        </g>
      )}
    </>
  );
});

export default RobotImageIcon;
