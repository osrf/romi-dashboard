import { MenuItem, TextField } from '@material-ui/core';
import { Permission } from 'api-client';
import React from 'react';
import { ConfirmationDialog } from 'react-components';
import { getActionText, RmfAction } from '../permissions';

export interface AddPermissionDialogProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
  savePermission?: (permission: Permission) => Promise<void> | void;
}

export function AddPermissionDialog({
  open,
  setOpen,
  savePermission,
}: AddPermissionDialogProps): JSX.Element {
  const [action, setAction] = React.useState('');
  const [authzGrp, setAuthzGrp] = React.useState('');
  const [actionError, setActionError] = React.useState(false);
  const [authzGrpError, setAuthzGrpError] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const validateForm = () => {
    let error = false;
    if (!action) {
      setActionError(true);
      error = true;
    } else {
      setActionError(false);
    }
    if (!authzGrp) {
      setAuthzGrpError(true);
      error = true;
    } else {
      setAuthzGrpError(false);
    }
    return !error;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setSaving(true);
    savePermission && (await savePermission({ action, authz_grp: authzGrp }));
    setSaving(false);
  };

  return (
    <ConfirmationDialog
      open={open}
      title="Add Permission"
      confirmText="Save"
      loading={saving}
      onSubmit={handleSubmit}
      onCancelClick={() => setOpen && setOpen(false)}
    >
      <TextField
        id="action-input"
        select
        variant="outlined"
        fullWidth
        label="Action"
        value={action}
        onChange={(ev) => setAction(ev.target.value)}
        error={actionError}
        helperText="Required"
      >
        {Object.values(RmfAction).map((act) => (
          <MenuItem key={act} value={act}>
            {getActionText(act)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="authz-grp-input"
        variant="outlined"
        fullWidth
        label="Authorization Group"
        value={authzGrp}
        onChange={(ev) => setAuthzGrp(ev.target.value)}
        error={authzGrpError}
        helperText="Required"
      />
    </ConfirmationDialog>
  );
}
