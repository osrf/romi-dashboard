import { Accordion, AccordionProps, makeStyles } from '@material-ui/core';
import Debug from 'debug';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { ErrorOverlay } from '../error-overlay';
import ItemAccordionDetails from '../item-accordion-details';
import ItemAccordionSummary from '../item-accordion-summary';
import { SimpleInfo, SimpleInfoProps } from '../simple-info';

const debug = Debug('Dispensers:DispenserAccordion');

interface DispenserInfoProps {
  dispenser: RmfModels.DispenserState;
  overrideStyle?: SimpleInfoProps['overrideStyle'];
}

const DispenserInfo = (props: DispenserInfoProps) => {
  const { dispenser, overrideStyle } = props;

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

  return <SimpleInfo infoData={data} overrideStyle={overrideStyle ? overrideStyle : undefined} />;
};

function dispenserModeToString(mode: number): string {
  switch (mode) {
    case RmfModels.DispenserState.IDLE:
      return 'IDLE';
    case RmfModels.DispenserState.BUSY:
      return 'ONLINE';
    case RmfModels.DispenserState.OFFLINE:
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

const overrideStyles = makeStyles(() => ({
  container: {
    display: 'table',
    borderCollapse: 'collapse',
    width: '100%',
    userSelect: 'none',
  },
}));

export interface DispenserAccordionProps extends Omit<AccordionProps, 'children'> {
  /**
   * Pre-condition: `dispenser === dispenserState.guid`
   */
  dispenserState: RmfModels.DispenserState | null;
  dispenser: string;
}

export const DispenserAccordion = React.forwardRef(
  (props: DispenserAccordionProps, ref: React.Ref<HTMLElement>) => {
    const { dispenserState, dispenser, ...otherProps } = props;
    debug(`render ${dispenser}`);
    const classes = useStyles();
    const overrideClasses = overrideStyles();

    // TODO: refactor this into a common custom hook to handle stored state
    // in future if we need it to track the states of other items.
    function usePrevDispenserState(dispenserState: RmfModels.DispenserState | null) {
      const ref = React.useRef<RmfModels.DispenserState | null>(null);
      React.useEffect(() => {
        if (dispenserState) {
          ref.current = dispenserState;
        }
      });
      return ref.current;
    }
    const previousState = usePrevDispenserState(dispenserState);
    // end of TODO

    const getStatusLabelClass = () => {
      switch (dispenserState?.mode) {
        case RmfModels.DispenserState.IDLE:
          return classes.statusLabelIdle;
        case RmfModels.DispenserState.BUSY:
          return classes.statusLabelBusy;
        case RmfModels.DispenserState.OFFLINE:
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
        <ItemAccordionDetails>
          <ErrorOverlay
            errorMsg={
              !dispenserState
                ? 'Dispenser is not sending states. Please check if it is working properly.'
                : null
            }
          >
            <React.Fragment>
              {dispenserState && <DispenserInfo dispenser={dispenserState} />}
              {!dispenserState && previousState && (
                <DispenserInfo dispenser={previousState} overrideStyle={overrideClasses} />
              )}
            </React.Fragment>
          </ErrorOverlay>
        </ItemAccordionDetails>
      </Accordion>
    );
  },
);

export default DispenserAccordion;
