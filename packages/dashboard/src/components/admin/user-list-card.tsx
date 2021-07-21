import {
  Button,
  Card,
  CardHeader,
  IconButton,
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { ConfirmationDialog } from 'react-components';
import { CreateUserDialog, CreateUserDialogProps } from './create-user-dialog';

const ItemsPerPage = 20;

const useStyles = makeStyles((theme) => ({
  controlsButton: {
    float: 'right',
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export interface UserListCardProps extends Pick<CreateUserDialogProps, 'createUser'> {
  searchUsers?: (search: string, limit: number, offset: number) => Promise<string[]> | string[];
  deleteUser?: (user: string) => Promise<void> | void;
  onUserClick?: (ev: React.MouseEvent, user: string) => void;
}

export function UserListCard({
  searchUsers,
  deleteUser,
  onUserClick,
  createUser,
}: UserListCardProps): JSX.Element {
  const classes = useStyles();
  const [users, setUsers] = React.useState<string[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const searchTimer = React.useRef<number | undefined>(undefined);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  React.useEffect(() => {
    if (!searchUsers) {
      return;
    }
    (async () => {
      const results = await searchUsers(search, ItemsPerPage + 1, ItemsPerPage * page);
      setHasMore(results.length > ItemsPerPage);
      setUsers(results.slice(0, ItemsPerPage));
    })();
  }, [searchUsers, search, page, refresh]);

  return (
    <Card variant="outlined">
      <CardHeader
        title="Users"
        titleTypographyProps={{ variant: 'h5' }}
        avatar={<AccountIcon fontSize="large" />}
        action={
          <>
            <TextField
              variant="outlined"
              id="search-users"
              label="Search Users"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchInput}
              onChange={(ev) => {
                const newInput = ev.target.value;
                setSearchInput(newInput);
                clearTimeout(searchTimer.current);
                searchTimer.current = window.setTimeout(() => setSearch(newInput), 500);
              }}
            />
            <IconButton
              color="primary"
              onClick={() => setOpenCreateDialog(true)}
              aria-label="create user"
            >
              <AddIcon color="primary" fontSize="large" />
            </IconButton>
          </>
        }
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u}
                className={classes.tableRow}
                onClick={(ev) => onUserClick && onUserClick(ev, u)}
              >
                <TableCell>{u}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    className={classes.controlsButton}
                    onClick={() => {
                      setSelectedUser(u);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={hasMore ? -1 : page * ItemsPerPage + users.length}
          page={page}
          rowsPerPage={ItemsPerPage}
          rowsPerPageOptions={[ItemsPerPage]}
          onChangePage={(_, newPage) => setPage(newPage)}
        />
      </TableContainer>
      <ConfirmationDialog
        open={openDeleteDialog}
        title="Confirm Delete"
        loading={deleting}
        onCancelClick={() => setOpenDeleteDialog(false)}
        onSubmit={async () => {
          setDeleting(true);
          try {
            selectedUser && deleteUser && (await deleteUser(selectedUser));
            setOpenDeleteDialog(false);
            setRefresh((prev) => prev + 1);
          } finally {
            setDeleting(false);
          }
        }}
      >
        <Typography>{`Are you sure you want to delete "${selectedUser}"?`}</Typography>
      </ConfirmationDialog>
      {openCreateDialog && (
        <CreateUserDialog
          open={openCreateDialog}
          setOpen={setOpenCreateDialog}
          createUser={async (u) => {
            createUser && (await createUser(u));
            setRefresh((prev) => prev + 1);
          }}
        />
      )}
    </Card>
  );
}
