import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { Emergency } from '../emergency-alarm';

export interface EmergencyDialogProps {
  handleClose(): void;
  open: boolean;
  type: Emergency;
}

export default function EmergencyDialog(props: EmergencyDialogProps): React.ReactElement {
  const { open, handleClose, type } = props;
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="emergency-dialog"
      open={open}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle id="emergency-dialog-title">
        <div>
          <Typography variant="h6">Emergency: {type.type}</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        <div className={classes.detail}>Message details here</div>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button autoFocus onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  dialogActions: {
    margin: 0,
    padding: theme.spacing(1),
  },
  detailLine: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5),
    width: '100%',
  },
  detail: {
    display: 'flex',
    flexFlow: 'column',
    padding: '1rem',
  },
}));
