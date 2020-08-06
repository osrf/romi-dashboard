import React from 'react';
import { actions } from '@storybook/addon-actions';

import Robot, { RobotProps } from '../../components/schedule-visualizer/robot';
import { viewBoxCoords, StyleTyping } from './Utils';

interface RobotComponentProps extends RobotProps {
  renderInfoPanel(): JSX.Element;
}

const styles: StyleTyping = {
  display: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
  },
};

export default function RobotComponent(props: RobotComponentProps): React.ReactElement {
  const { robot, footprint, colorManager, renderInfoPanel } = props;

  return (
    <div style={styles.display}>
      {renderInfoPanel()}

      <svg viewBox={viewBoxCoords}>
        <Robot
          robot={robot}
          footprint={footprint}
          colorManager={colorManager}
          {...actions('onClick')}
        />
      </svg>
    </div>
  );
}
