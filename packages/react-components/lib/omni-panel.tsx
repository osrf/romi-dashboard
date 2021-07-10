import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import React, { ReactElement } from 'react';
import { joinClasses } from './css-utils';
import { OmniPanelViewProps } from './omni-panel-view';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    borderRadius: '16px 16px 0px 0px',
  },
  viewContainer: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTop: 0,
  },
  navigationButton: {
    borderRadius: 'inherit',
  },
  navigationButtonGroup: {
    borderRadius: 'inherit',
  },
  slideIn: {
    position: 'relative',
    height: '100%',
    overflow: 'auto',
  },
  slideOut: {
    position: 'absolute',
  },
}));

export interface OmniPanelProps extends React.HTMLProps<HTMLDivElement> {
  stack: (number | string)[];
  children: React.ReactElement<OmniPanelViewProps>[] | React.ReactElement<OmniPanelViewProps>;
  variant?: 'backHome' | 'backHomeClose';
  timeout?: number;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  onBack?: React.MouseEventHandler<HTMLButtonElement>;
  onHome?: React.MouseEventHandler<HTMLButtonElement>;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}

export const OmniPanel = (props: OmniPanelProps): JSX.Element => {
  const {
    stack,
    children,
    variant,
    timeout,
    mountOnEnter,
    unmountOnExit = true,
    onBack,
    onHome,
    onClose,
    ...otherProps
  } = props;
  const classes_ = useStyles();

  const renderView = (child: ReactElement<OmniPanelViewProps>) => {
    const slideIn = stack[stack.length - 1] === child.props.viewId;
    return (
      <Slide
        key={child.props.viewId}
        direction="left"
        in={slideIn}
        appear={false}
        timeout={timeout}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
      >
        <div className={joinClasses(slideIn ? classes_.slideIn : classes_.slideOut)}>{child}</div>
      </Slide>
    );
  };
  return (
    <div {...otherProps}>
      <div className={classes_.mainContainer}>
        <ButtonGroup fullWidth className={classes_.navigationButtonGroup}>
          <Button
            className={classes_.navigationButton}
            onClick={onBack}
            aria-label="Back"
            startIcon={<BackIcon />}
            size="large"
          />
          <Button
            className={classes_.navigationButton}
            onClick={onHome}
            aria-label="Home"
            startIcon={<HomeIcon />}
            size="large"
          />
          {variant === 'backHomeClose' && (
            <Button
              className={classes_.navigationButton}
              onClick={onClose}
              aria-label="Close"
              startIcon={<CloseIcon />}
              size="large"
            />
          )}
        </ButtonGroup>
        <div className={classes_.viewContainer}>
          {Array.isArray(children) ? children.map(renderView) : renderView(children)}
        </div>
      </div>
    </div>
  );
};

export default OmniPanel;
