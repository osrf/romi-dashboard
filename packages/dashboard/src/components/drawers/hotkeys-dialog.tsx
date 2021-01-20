import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { getApplicationKeyMap } from 'react-hotkeys';

export interface HotKeysDialogProps {
  handleClose(): void;
  open: boolean;
}

export default function HotKeysDialog(props: HotKeysDialogProps): React.ReactElement {
  const { open, handleClose } = props;
  const classes = useStyles();
  const keyMap = getApplicationKeyMap();
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle id="customized-dialog-title">
        <div>
          <Typography variant="h6">Hotkeys</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        <div className={classes.detail}>
          {Object.values(keyMap).map((hotkey) => {
            return (
              hotkey.name && (
                <React.Fragment key={hotkey.name}>
                  <div detail-type={'hotkeyDetail'} className={classes.detailLine}>
                    <Typography variant="body1">{hotkey.name}:</Typography>
                    <Typography variant="body1">{hotkey.sequences[0].sequence}</Typography>
                  </div>
                  <Divider />
                </React.Fragment>
              )
            );
          })}
        </div>
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
