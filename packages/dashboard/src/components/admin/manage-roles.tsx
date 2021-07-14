import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { Loading, TransferList } from '../../../../react-components/dist';
import { RoleListCard } from './role-list';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    height: '50vh',
  },
  dialogButton: {
    width: 100,
  },
}));

export interface ManageRolesDialogProps extends Omit<DialogProps, 'onClose'> {
  defaultAssignedRoles: string[];
  setOpen: (open: boolean) => void;
  getAllRoles: () => Promise<string[]>;
  saveRoles: (roles: string[]) => Promise<void>;
}

export function ManageRolesDialog({
  defaultAssignedRoles,
  setOpen,
  getAllRoles,
  saveRoles,
  open,
  ...dialogProps
}: ManageRolesDialogProps): JSX.Element {
  const classes = useStyles();
  const [availableRoles, setAvailableRoles] = React.useState<string[]>([]);
  const [assignedRoles, setAssignedRoles] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    setLoading(true);
    (async () => {
      const allRoles = await getAllRoles();
      setAvailableRoles(allRoles.filter((r) => defaultAssignedRoles.indexOf(r) === -1).sort());
      setAssignedRoles(defaultAssignedRoles.sort());
      setLoading(false);
    })();
  }, [open, getAllRoles, defaultAssignedRoles]);

  const handleOkClick = () => {
    setSaving(true);
    (async () => {
      await saveRoles(assignedRoles);
      setSaving(false);
      setOpen(false);
    })();
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={() => setOpen(false)} {...dialogProps}>
      <DialogTitle>Manage Roles</DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Loading loading={loading} size="5em">
          <TransferList
            leftItems={availableRoles}
            rightItems={assignedRoles}
            leftTitle="Available Roles"
            rightTitle="Assigned Roles"
            onTransfer={(left, right) => {
              setAvailableRoles(left.sort());
              setAssignedRoles(right.sort());
            }}
          />
        </Loading>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          aria-label="Cancel"
          className={classes.dialogButton}
          onClick={() => {
            setLoading(false);
            setOpen(false);
          }}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          aria-label="OK"
          disabled={saving}
          className={classes.dialogButton}
          onClick={handleOkClick}
        >
          <Loading hideChildren loading={saving} size="1.5em" color="inherit">
            Save
          </Loading>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ManageRolesCardProps
  extends Pick<ManageRolesDialogProps, 'getAllRoles' | 'saveRoles'> {
  assignedRoles: string[];
}

export function ManageRolesCard({
  assignedRoles,
  getAllRoles,
  saveRoles,
}: ManageRolesCardProps): JSX.Element {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <>
      <RoleListCard
        roles={assignedRoles}
        action={
          <Button
            variant="contained"
            color="primary"
            aria-label="Add/Remove"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Add/Remove
          </Button>
        }
      />
      <ManageRolesDialog
        open={openDialog}
        setOpen={setOpenDialog}
        defaultAssignedRoles={assignedRoles}
        getAllRoles={getAllRoles}
        saveRoles={saveRoles}
      />
    </>
  );
}
