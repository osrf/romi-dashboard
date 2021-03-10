import {
  Divider,
  Drawer,
  DrawerProps,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import React from 'react';
import DrawerHeader from './drawer-header';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

export interface AlarmDrawerProps extends DrawerProps {
  handleCloseButton(): void;
  triggerCodeBlue(): void;
  triggerCodeRed(): void;
}

export default function AlarmDrawer(props: AlarmDrawerProps): React.ReactElement {
  const { handleCloseButton, triggerCodeBlue, triggerCodeRed, ...otherProps } = props;
  const classes = useStyles();
  const drawerAnchor = useMediaQuery('(max-aspect-ratio: 8/10)') ? 'bottom' : 'right';
  const modalProp = {
    disableEnforceFocus: true,
  };

  return (
    <Drawer
      PaperProps={{ className: classes.drawer }}
      anchor={drawerAnchor}
      ModalProps={modalProp}
      {...otherProps}
    >
      <DrawerHeader handleCloseButton={handleCloseButton} title={'Alarms'} />
      <div className={classes.detail} id="alarm-drawer-options">
        <div
          className={classes.detailLine}
          onClick={() => {
            handleCloseButton();
            triggerCodeBlue();
          }}
        >
          <IconButton id="trigger-code-blue-btn" aria-label="code-blue" color="primary">
            <LocalHospitalIcon />
          </IconButton>
          <Typography variant="h5"> Code Blue </Typography>
        </div>
        <Divider />

        <div
          className={classes.detailLine}
          onClick={() => {
            handleCloseButton();
            triggerCodeRed();
          }}
        >
          <IconButton id="trigger-code-red-btn" color="secondary">
            <NotificationsActiveIcon />
          </IconButton>
          <Typography variant="h5"> Code Red </Typography>
        </div>
        <Divider />
      </div>
    </Drawer>
  );
}

const useStyles = makeStyles((theme) => ({
  detailLine: {
    display: 'inline-flex',
    padding: theme.spacing(0.5),
    width: '100%',
    '& button': {
      padding: '0 5px 0 0',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    cursor: 'pointer',
  },
  detail: {
    display: 'flex',
    flexFlow: 'column',
    padding: '1rem',
  },
  drawer: {
    '@media (min-aspect-ratio: 8/10)': {
      width: 300,
    },
    '@media (max-aspect-ratio: 8/10)': {
      width: '100%',
    },
  },
}));
