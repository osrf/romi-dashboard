import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  Divider,
  makeStyles,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React from 'react';
import ItemAccordionDetails from '../item-accordion-details';
import ItemAccordionSummary from '../item-accordion-summary';
import { SimpleInfo } from '../simple-info';

const debug = Debug('Dispensers:DispenserAccordion');

interface DispenserInfoProps {
  dispenser: RomiCore.DispenserState;
}

const DispenserInfo = (props: DispenserInfoProps) => {
  const { dispenser } = props;

  const data = [
    { name: 'Name', value: dispenser.guid },
    { name: 'No. Queued Requests', value: dispenser.request_guid_queue.length },
    {
      name: 'Request Queue ID',
      value: dispenser.request_guid_queue.length ? dispenser.request_guid_queue : 'Unknown',
      disabled: !!dispenser.request_guid_queue.length,
    },
    { name: 'Seconds Remaining', value: dispenser.seconds_remaining },
  ];

  return <SimpleInfo infoData={data} />;
};

function dispenserModeToString(mode: number): string {
  switch (mode) {
    case RomiCore.DispenserState.IDLE:
      return 'IDLE';
    case RomiCore.DispenserState.BUSY:
      return 'ONLINE';
    case RomiCore.DispenserState.OFFLINE:
      return 'OFFLINE';
    default:
      return 'N/A';
  }
}

const useStyles = makeStyles((theme) => ({
  statusLabelIdle: { borderColor: theme.palette.warning.main },
  statusLabelBusy: { borderColor: theme.palette.success.main },
  statusLabelOffline: { borderColor: theme.palette.error.main },
  typography: {
    padding: '1rem',
  },
}));

export interface DispenserAccordionProps extends Omit<AccordionProps, 'children'> {
  /**
   * Pre-condition: `dispenser === dispenserState.guid`
   */
  dispenserState: RomiCore.DispenserState | null;
  dispenser: string;
}

export const DispenserAccordion = React.forwardRef(
  (props: DispenserAccordionProps, ref: React.Ref<HTMLElement>) => {
    const { dispenserState, dispenser, ...otherProps } = props;
    debug(`render ${dispenser}`);
    const classes = useStyles();

    const getStatusLabelClass = () => {
      switch (dispenserState?.mode) {
        case RomiCore.DispenserState.IDLE:
          return classes.statusLabelIdle;
        case RomiCore.DispenserState.BUSY:
          return classes.statusLabelBusy;
        case RomiCore.DispenserState.OFFLINE:
          return classes.statusLabelOffline;
        default:
          return null;
      }
    };

    const statusLabelClass = getStatusLabelClass();

    return (
      <Accordion ref={ref} {...otherProps}>
        <ItemAccordionSummary
          title={dispenserState ? dispenserState.guid : dispenser}
          statusProps={{
            className: statusLabelClass ? statusLabelClass : undefined,
            text: dispenserState ? dispenserModeToString(dispenserState.mode) : 'UNKNOWN',
            variant: statusLabelClass ? 'normal' : 'unknown',
          }}
        />
        {dispenserState ? (
          <ItemAccordionDetails>
            <DispenserInfo dispenser={dispenserState} />
          </ItemAccordionDetails>
        ) : (
          <AccordionDetails>
            <Divider />
            <Typography className={classes.typography} variant="body1">
              The state of <b>{dispenser}</b> dispenser is unknown. Please check if{' '}
              <b>{dispenser} </b>
              is working properly.
            </Typography>
          </AccordionDetails>
        )}
      </Accordion>
    );
  },
);

export default DispenserAccordion;
