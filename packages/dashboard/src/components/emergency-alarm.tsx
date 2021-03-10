import { IconButton } from '@material-ui/core';
import React from 'react';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

export interface Emergency {
  type: string;
}

export interface EmergencyAlarmProps {
  isActive: boolean | null;
}

/**
 * TODO: This component represents the emergency alarm. It is kept as a separate component in case
 * more logic needs to be added in the future, such as turning the alarm on and off. This component
 * is on hold until an appropriate backend is available to manage the alarm.
 *
 */
export const EmergencyAlarm = React.memo((props: EmergencyAlarmProps) => {
  const { isActive } = props;
  return (
    <>
      {isActive && (
        <IconButton id="alarm-btn" color={'secondary'}>
          <NotificationsActiveIcon />
        </IconButton>
      )}
    </>
  );
});
