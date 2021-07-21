import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  PaperProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { Permission } from 'api-client';
import React from 'react';
import { getActionText } from '../permissions';
import { AddPermissionDialog, AddPermissionDialogProps } from './add-permission-dialog';

const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },
  tableContainer: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    width: 'auto',
  },
  controlsButton: {
    float: 'right',
  },
}));

export interface PermissionsCardProps
  extends PaperProps,
    Pick<AddPermissionDialogProps, 'savePermission'> {
  permissions?: Permission[];
  onRemovePermissionClick?: (ev: React.MouseEvent, permission: Permission) => void;
}

export function PermissionsCard({
  permissions = [],
  savePermission,
  onRemovePermissionClick,
  ...otherProps
}: PermissionsCardProps): JSX.Element {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);

  // sort by action first, then by authorization group
  permissions.sort((a, b) => {
    if (a.action < b.action) return -1;
    if (a.action > b.action) return 1;
    if (a.authz_grp < b.authz_grp) return -1;
    if (a.authz_grp > b.authz_grp) return 1;
    return 0;
  });

  return (
    <Paper elevation={0} {...otherProps}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Permissions
        </Typography>
        <IconButton onClick={() => setOpenDialog(true)} aria-label="add permission">
          <AddIcon fontSize="large" color="primary" />
        </IconButton>
      </Toolbar>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Authorization Group</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((p, idx) => (
              <TableRow key={idx}>
                <TableCell>{getActionText(p.action)}</TableCell>
                <TableCell>{p.authz_grp}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    className={classes.controlsButton}
                    onClick={(ev) => onRemovePermissionClick && onRemovePermissionClick(ev, p)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddPermissionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        savePermission={async (p) => {
          savePermission && (await savePermission(p));
          setOpenDialog(false);
        }}
      />
    </Paper>
  );
}
