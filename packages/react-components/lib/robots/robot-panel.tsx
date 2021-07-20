import React from 'react';
import {
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
  TablePagination,
  Toolbar,
} from '@material-ui/core';
import { RobotInfo } from './robot-info';
import { RobotTable } from './robot-table';
import { Autorenew as AutorenewIcon, Refresh as RefreshIcon } from '@material-ui/icons';
import { VerboseRobot } from './utils';

const useStyles = makeStyles((theme) => ({
  detailPanelContainer: {
    width: 350,
    padding: theme.spacing(2),
    marginLeft: theme.spacing(1),
    flex: '0 0 auto',
  },
  robotTable: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flex: '1 1 100%',
  },
  enabledToggleButton: {
    background: theme.palette.action.selected,
  },
}));

function NoSelectedRobot() {
  return (
    <Grid container wrap="nowrap" alignItems="center" style={{ height: '100%' }}>
      <Typography variant="h6" align="center" color="textSecondary">
        Click on a robot to view more information
      </Typography>
    </Grid>
  );
}

export interface RobotPanelProps extends React.HTMLProps<HTMLDivElement> {
  paginationOptions?: Omit<React.ComponentPropsWithoutRef<typeof TablePagination>, 'component'>;
  verboseRobots: VerboseRobot[];
  onAutoRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh?: () => Promise<VerboseRobot[]>;
}

export function RobotPanel({
  paginationOptions,
  verboseRobots,
  onRefresh,
  onAutoRefresh,
  ...divProps
}: RobotPanelProps): JSX.Element {
  const classes = useStyles();
  const [selectedRobot, setSelectedRobot] = React.useState<VerboseRobot | undefined>(undefined);
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  const handleRefresh = async (selectedRobot?: VerboseRobot) => {
    (async () => {
      const result = await (onRefresh && onRefresh());
      result?.forEach((robot) => {
        if (selectedRobot && robot.name === selectedRobot.name) {
          setSelectedRobot(robot);
        }
      });
    })();
  };

  React.useEffect(() => {
    verboseRobots.forEach((robot) => {
      if (selectedRobot && robot.name === selectedRobot.name) {
        setSelectedRobot(robot);
      }
    });
  }),
    [selectedRobot, verboseRobots];

  return (
    <div {...divProps}>
      <Grid container wrap="nowrap" justify="center" style={{ height: 'inherit' }}>
        <Grid style={{ flex: '1 1 auto' }}>
          <Paper className={classes.robotTable}>
            <Toolbar>
              <Typography className={classes.title} variant="h6">
                Robots
              </Typography>
              <IconButton
                className={autoRefresh ? classes.enabledToggleButton : undefined}
                onClick={() => {
                  setAutoRefresh((prev) => !prev);
                  onAutoRefresh && onAutoRefresh(!autoRefresh);
                }}
              >
                <AutorenewIcon />
              </IconButton>
              <IconButton onClick={() => handleRefresh(selectedRobot)} aria-label="Refresh">
                <RefreshIcon />
              </IconButton>
            </Toolbar>
            <RobotTable
              robots={verboseRobots}
              paginationOptions={paginationOptions}
              onRobotClick={(_ev, robot) => setSelectedRobot(robot)}
            />
          </Paper>
        </Grid>
        <Paper className={classes.detailPanelContainer}>
          {selectedRobot ? <RobotInfo robot={selectedRobot} /> : <NoSelectedRobot />}
        </Paper>
      </Grid>
    </div>
  );
}
