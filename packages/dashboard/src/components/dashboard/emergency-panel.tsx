import React from 'react';
import { makeStyles } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { Alert, AlertTitle } from '@material-ui/lab';
import StyledChip from '../styled-chip';

/*
The Emergency Panel subscribes to the node that publishes an alarm state.
With the alarm state, active robots can be triggered to move towards
an emergency / nearest docking station so that they are kept out of the way.
*/

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    borderRadius: 'inherit',
  },
  viewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  statusButton: {
    color: theme.palette.text.primary,
  },
  messageContainer: {
    width: '100%',
    display: 'flex',
    marginTop: '1em',
    marginBottom: '1em',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
  },
  triggerButton: {
    '@media (min-aspect-ratio: 8/10)': {
      width: '65%',
      textAlign: 'center',
      margin: 'auto',
    },
    '@media (max-aspect-ratio: 8/10)': {
      width: '35%',
      textAlign: 'center',
      margin: 'auto',
    },
  },
  cardRoot: {
    width: '90%',
    margin: 'auto',
  },
  pos: {
    marginBottom: 12,
  },
}));

export interface EmergencyPanelProps extends React.HTMLProps<HTMLDivElement> {
  emergencyState: string;
}
export const EmergencyPanel = (props: EmergencyPanelProps): JSX.Element => {
  const { emergencyState } = props;
  const classes_ = useStyles();

  return (
    <div className={classes_.mainContainer}>
      <Button variant="outlined" className={classes_.statusButton}>
        <StyledChip state={emergencyState} />
      </Button>
      <div className={classes_.messageContainer}>
        <Card className={classes_.cardRoot}>
          <CardContent>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Alert severity="error">
                  <AlertTitle>Emergency</AlertTitle>
                  This is a code-red alert.
                </Alert>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" component="p">
                  Do less with more. Can my website be in english? this turned out different that i
                  decscribed or that's great, but can you make it work for ie 2 please labrador is
                  there a way we can make the page feel more introductory without being cheesy. I
                  really like the colour but can you change it i know you've made thirty iterations
                  but can we go back to the first one that was the best version
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Alert severity="error" color="info">
                  <AlertTitle>Emergency</AlertTitle>
                  This is a code-blue alert.
                </Alert>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" component="p">
                  we need to make the new version clean and sexy. Needs to be sleeker it's great,
                  can you add a beard though . Just do what you think. I trust you it needs to be
                  the same, but totally different .
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className={classes_.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          className={classes_.triggerButton}
          type="submit"
        >
          Dock All Active Robots
        </Button>
      </div>
    </div>
  );
};

export default EmergencyPanel;
