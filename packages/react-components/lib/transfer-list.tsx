import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100%',
      '& > *': {
        height: '100%',
        flex: '1 1 0',
      },
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
    transferControls: {
      marginTop: 'auto',
      marginBottom: 'auto',
      height: 'auto',
      flex: '0 0 auto',
    },
  }),
);

interface CustomListProps {
  title: React.ReactNode;
  items: string[];
  checked: Set<string>;
  setChecked: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function CustomList({ title, items, checked, setChecked }: CustomListProps) {
  const classes = useStyles();
  const numberOfChecked = checked.size;

  const handleToggleAllClick = React.useCallback(() => {
    if (numberOfChecked < items.length) {
      setChecked(new Set(items.values()));
    } else {
      setChecked(new Set());
    }
  }, [items, numberOfChecked, setChecked]);

  return (
    <Card variant="outlined" className={classes.container}>
      <Grid container direction="column" wrap="nowrap">
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={handleToggleAllClick}
              checked={numberOfChecked > 0}
              indeterminate={numberOfChecked > 0 && numberOfChecked < items.length}
              disabled={items.length === 0}
              inputProps={{ 'aria-label': 'all items selected' }}
            />
          }
          title={title}
          subheader={`${numberOfChecked}/${items.length} selected`}
        />
        <Divider />
        <List className={classes.list} dense disablePadding component="div" role="list">
          {items.map((item) => {
            const labelId = `transfer-list-all-item-${item}-label`;

            return (
              <ListItem
                key={item}
                role="listitem"
                button
                onClick={() =>
                  setChecked((prev) => {
                    if (prev.has(item)) {
                      prev.delete(item);
                    } else {
                      prev.add(item);
                    }
                    return new Set(prev);
                  })
                }
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.has(item)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Grid>
    </Card>
  );
}

export interface TransferListProps {
  leftItems: string[];
  rightItems: string[];
  leftTitle?: React.ReactNode;
  rightTitle?: React.ReactNode;
  onTransfer?: (leftItems: string[], rightItems: string[]) => void;
}

export function TransferList({
  leftItems,
  rightItems,
  leftTitle = 'Choices',
  rightTitle = 'Choices',
  onTransfer,
}: TransferListProps): JSX.Element {
  const classes = useStyles();
  const [leftChecked, setLeftChecked] = React.useState<Set<string>>(new Set());
  const [rightChecked, setRightChecked] = React.useState<Set<string>>(new Set());

  return (
    <Grid container spacing={2} justify="center" alignItems="stretch" className={classes.container}>
      <CustomList
        title={leftTitle}
        items={leftItems}
        checked={leftChecked}
        setChecked={setLeftChecked}
      />
      <Grid item className={classes.transferControls}>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => {
              const newLeft = leftItems.filter((val) => !leftChecked.has(val));
              const newRight = rightItems.concat(Array.from(leftChecked.values()));
              onTransfer && onTransfer(newLeft, newRight);
              setLeftChecked(new Set());
            }}
            disabled={leftChecked.size === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => {
              const newRight = rightItems.filter((val) => !rightChecked.has(val));
              const newLeft = leftItems.concat(Array.from(rightChecked.values()));
              onTransfer && onTransfer(newLeft, newRight);
              setRightChecked(new Set());
            }}
            disabled={rightChecked.size === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <CustomList
        title={rightTitle}
        items={rightItems}
        checked={rightChecked}
        setChecked={setRightChecked}
      />
    </Grid>
  );
}
