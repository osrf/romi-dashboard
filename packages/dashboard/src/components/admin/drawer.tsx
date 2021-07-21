import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SecurityIcon from '@material-ui/icons/Security';
import React from 'react';

export type AdminDrawerValues = 'Users' | 'Roles';

const DrawerMinWidth = 180;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    minWidth: DrawerMinWidth,
  },
  itemIcon: {
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  activeItem: {
    backgroundColor: `${theme.palette.primary.light} !important`,
  },
}));

export interface AdminDrawerProps {
  active: AdminDrawerValues;
  onItemClick?: (ev: React.MouseEvent, item: AdminDrawerValues) => void;
}

export function AdminDrawer({ active, onItemClick }: AdminDrawerProps): JSX.Element {
  const classes = useStyles();

  const DrawerItem = React.useCallback(
    ({ Icon, text }: { Icon: SvgIconComponent; text: AdminDrawerValues }) => {
      return (
        <ListItem
          button
          className={active === text ? classes.activeItem : undefined}
          onClick={(ev) => {
            if (active === text) {
              return;
            }
            onItemClick && onItemClick(ev, text);
          }}
        >
          <ListItemIcon>
            <Icon className={classes.itemIcon} />
          </ListItemIcon>
          <ListItemText>{text}</ListItemText>
        </ListItem>
      );
    },
    [active, classes.activeItem, classes.itemIcon, onItemClick],
  );

  return (
    <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
      <List>
        <DrawerItem text="Users" Icon={AccountIcon} />
        <DrawerItem text="Roles" Icon={SecurityIcon} />
      </List>
    </Drawer>
  );
}
