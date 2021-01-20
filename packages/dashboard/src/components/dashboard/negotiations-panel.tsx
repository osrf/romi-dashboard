import { Button, ButtonGroup, makeStyles, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RestoreIcon from '@material-ui/icons/Restore';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import Debug from 'debug';
import React from 'react';
import {
  NegotiationConflict,
  NegotiationStatus,
  NegotiationStatusManager,
  NegotiationTrajectoryResponse,
  ResolveState,
} from '../../managers/negotiation-status-manager';
import { colorPalette } from '../../util/css-utils';
import { SpotlightValue } from '../spotlight-value';

const debug = Debug('OmniPanel:NegotiationsPanel');

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
  },
  finished: {
    backgroundColor: 'lightgreen',
  },
  rejected: {
    backgroundColor: theme.palette.warning.main,
  },
  forfeited: {
    backgroundColor: theme.palette.warning.main,
  },
  defunct: {
    backgroundColor: theme.palette.error.main,
  },
  unresolved: {
    backgroundColor: theme.palette.error.main,
  },
  ongoing: {
    backgroundColor: 'yellow',
  },
  treeChildren: {
    margin: '0.5rem 0',
  },
  labelContent: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 0 25px 0 rgb(72, 94, 116, 0.3)',
  },
  expanded: {
    borderLeft: `0.1rem solid ${colorPalette.unknown}`,
  },
  buttonGroupDiv: {
    padding: '0.5rem 1rem',
  },
}));

interface Parameter {
  map_name: string;
  conflict_version: number;
  sequence: number[];
}

export interface NegotiationsPanelProps {
  conflicts: Record<string, NegotiationConflict>;
  spotlight?: SpotlightValue<string>;
  mapFloorLayerSorted?: string[];
  negotiationStatusManager?: Readonly<NegotiationStatusManager>;
  negotiationTrajStore?: Record<string, NegotiationTrajectoryResponse>;
  negotiationStatusUpdateTS: number; // used to trigger rerenders
  setNegotiationTrajStore: React.Dispatch<
    React.SetStateAction<Record<string, NegotiationTrajectoryResponse>>
  >;
}

export const NegotiationsPanel = React.memo((props: NegotiationsPanelProps) => {
  debug('negotiation status panel render');
  const {
    conflicts,
    spotlight,
    mapFloorLayerSorted,
    negotiationStatusManager,
    negotiationTrajStore,
    setNegotiationTrajStore,
  } = props;

  const [negotiationContents, setNegotiationContents] = React.useState<{
    [key: string]: JSX.Element;
  }>({});
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string>('');
  const [conflictIds, setConflictIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!spotlight) {
      return;
    }
    // TODO: spotlight
  }, [spotlight]);

  let curLevelName = '';
  if (mapFloorLayerSorted) curLevelName = mapFloorLayerSorted[0];

  const classes = useStyles();

  /**  Utility conversion functions **/
  const determineStatusText = (
    status: NegotiationStatus,
    parent_resolved: ResolveState,
  ): string => {
    if (status.forfeited) return '  [FORFEITED]';
    else if (status.rejected) return '  [REJECTED]';
    else if (status.defunct) return '  [DEFUNCT]';
    else if (parent_resolved === ResolveState.RESOLVED) return '  [FINISHED]';
    else return '  [ONGOING]';
  };
  const determineStyle = (status: NegotiationStatus, parent_resolved: ResolveState): string => {
    if (status.forfeited) return classes.forfeited;
    else if (status.rejected) return classes.rejected;
    else if (status.defunct) return classes.defunct;
    else if (parent_resolved === ResolveState.RESOLVED) return classes.finished;
    else return classes.ongoing;
  };

  // keep track of parameters so we can send them as requests
  let nodeidToParameters = new Map<string, Parameter>();

  /** Render Negotiation panel contents **/
  const renderNegotiations = (version: string, conflict: NegotiationConflict) => {
    let conflictLabel = 'Conflict #' + version + ', Participants: ';
    let i = 0;
    for (const name of Object.values(conflict.participantIdsToNames)) {
      conflictLabel += name;

      if (i !== Object.keys(conflict.participantIdsToNames).length - 1) conflictLabel += ', ';
      ++i;
    }
    let conflictStyle = classes.ongoing;
    if (conflict.resolved === ResolveState.RESOLVED) conflictStyle = classes.finished;
    else if (conflict.resolved === ResolveState.FAILED) conflictStyle = classes.unresolved;

    let tableDom: JSX.Element[] = [];
    for (const [participantId, statusData] of Object.entries(conflict.participantIdsToStatus)) {
      // status handling and background
      const participantName = conflict.participantIdsToNames[participantId];

      // add 1 or 2 rows of data depending on the sequence

      if (statusData.hasTerminal && statusData.terminal.sequence.length > 1) {
        const terminalStatus = statusData.terminal;

        //set text and style for terminal node
        let terminalLabelText = participantName;
        terminalLabelText += ' -> [';
        const lastIdx = terminalStatus.sequence.length - 1;
        for (let idx = 0; idx < lastIdx; ++idx) {
          let sequenceId = terminalStatus.sequence[idx].toString();
          let sequenceIdName = conflict.participantIdsToNames[sequenceId];

          terminalLabelText += sequenceIdName;
          if (idx !== lastIdx - 1) terminalLabelText += ', ';
        }
        terminalLabelText += ']';
        terminalLabelText += determineStatusText(terminalStatus, conflict.resolved);
        let terminalStyle = `${determineStyle(terminalStatus, conflict.resolved)} ${
          classes.labelContent
        }`;

        //set text and style for base node
        let baseStatus = statusData.base;

        let baseLabelText = '[';
        const sequenceIdName = conflict.participantIdsToNames[baseStatus.sequence[0]];
        baseLabelText += sequenceIdName;
        baseLabelText += ']';
        baseLabelText += determineStatusText(baseStatus, conflict.resolved);
        let baseStyle = `${determineStyle(baseStatus, conflict.resolved)} ${classes.labelContent}`;

        let terminalId = version + '.' + participantId + '.terminal'; //terminal node
        let baseId = version + '.' + participantId + '.base'; //base ID
        tableDom.push(
          <TreeItem
            data-component="TreeItem"
            nodeId={terminalId}
            key={terminalId}
            classes={{
              label: terminalStyle,
              expanded: classes.expanded,
              root: classes.treeChildren,
            }}
            label={terminalLabelText}
          >
            <TreeItem
              data-component="TreeItem"
              nodeId={baseId}
              key={baseId}
              classes={{ label: baseStyle, root: classes.treeChildren }}
              label={baseLabelText}
            />
          </TreeItem>,
        );

        let terminalParams = {
          map_name: curLevelName,
          conflict_version: parseInt(version),
          sequence: terminalStatus.sequence,
        };
        nodeidToParameters.set(terminalId, terminalParams);

        let baseParams = {
          map_name: curLevelName,
          conflict_version: parseInt(version),
          sequence: baseStatus.sequence,
        };
        nodeidToParameters.set(baseId, baseParams);
      } else {
        //single node
        let baseStatus = statusData.base;
        let labelText = participantName + determineStatusText(baseStatus, conflict.resolved);
        let style = `${determineStyle(baseStatus, conflict.resolved)} ${classes.labelContent}`;
        let nodeId = version + '.' + participantId + '.base'; //base ID

        tableDom.push(
          <TreeItem
            data-component="TreeItem"
            nodeId={nodeId}
            key={nodeId}
            classes={{ label: style, root: classes.treeChildren }}
            label={labelText}
          />,
        );

        let baseParams = {
          map_name: curLevelName,
          conflict_version: parseInt(version),
          sequence: baseStatus.sequence,
        };
        nodeidToParameters.set(nodeId, baseParams);
      }
    }

    conflictStyle = `${conflictStyle} ${classes.labelContent}`;
    let nodeIdBase = 'conflict' + version;
    return (
      <TreeItem
        data-component="TreeItem"
        nodeId={nodeIdBase}
        key={nodeIdBase}
        classes={{ label: conflictStyle, expanded: classes.expanded, root: classes.treeChildren }}
        label={conflictLabel}
      >
        {tableDom}
      </TreeItem>
    );
  };

  const updateNegotiationContents = (
    conflicts: Readonly<Record<string, NegotiationConflict>>,
    parsedConflictIds?: string[],
  ) => {
    Object.keys(conflicts).forEach((version) => {
      const conflict = conflicts[version];
      let contents = renderNegotiations(version, conflict);
      if (parsedConflictIds && !parsedConflictIds.includes(version)) {
        negotiationContents[version] = contents;
      } else if (!parsedConflictIds) {
        negotiationContents[version] = contents;
      }
    });
  };

  if (conflicts) {
    if (conflictIds.length > 0) {
      updateNegotiationContents(conflicts, conflictIds);
    } else {
      updateNegotiationContents(conflicts);
    }
  } else {
    console.log('prop negotationstatus empty');
  }

  // action callbacks
  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string): void => {
    async function updateNegotiationTrajectory() {
      if (!negotiationStatusManager || !negotiationTrajStore) {
        return;
      }

      const trajParams = nodeidToParameters.get(nodeIds);
      if (!trajParams) {
        // Must have clicked a top level node
        return;
      }

      const resp = await negotiationStatusManager.negotiationTrajectory({
        request: 'negotiation_trajectory',
        param: trajParams,
      });
      if (resp.values === undefined) console.warn('values undefined!');
      if (resp.response !== 'negotiation_trajectory') {
        console.warn('wrong response, ignoring!');
        return;
      }
      // reset and add new trajectories
      for (let resp of Object.values(negotiationTrajStore)) {
        resp.values = [];
      }
      resp.values.forEach((traj) => {
        if (negotiationTrajStore[traj.map_name] === undefined)
          negotiationTrajStore[traj.map_name] = {
            response: 'negotiation_trajectory',
            values: [],
          };
        negotiationTrajStore[traj.map_name].values.push(traj);
      });
    }

    updateNegotiationTrajectory();
    setSelected(nodeIds);
  };

  const handleClearAllCurrNegotiations = () => {
    setConflictIds(Object.keys(conflicts));
    setNegotiationContents({});
  };

  const handleResetNegotiations = () => {
    setExpanded([]);
    setSelected('');
    setNegotiationTrajStore({});
  };

  const handleRestoreNegotiations = () => {
    setConflictIds([]);
    setNegotiationContents({});
  };

  const handleNodeToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  return (
    <Typography variant="body1" component={'span'}>
      <div className={classes.buttonGroupDiv}>
        <ButtonGroup fullWidth>
          <Button
            id="reset-button"
            disabled={conflicts && Object.keys(conflicts).length === 0}
            onClick={handleResetNegotiations}
          >
            <RestoreIcon />
            Reset
          </Button>
          <Button
            id="clear-button"
            disabled={conflicts && Object.keys(conflicts).length === 0}
            onClick={handleClearAllCurrNegotiations}
          >
            <ClearAllIcon />
            Clear
          </Button>
          <Button
            id="restore-button"
            disabled={conflicts && Object.keys(conflicts).length === 0}
            onClick={handleRestoreNegotiations}
          >
            <RestoreFromTrashIcon />
            Restore
          </Button>
        </ButtonGroup>
      </div>
      <TreeView
        className={classes.root}
        onNodeSelect={handleSelect}
        onNodeToggle={handleNodeToggle}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
      >
        {Object.keys(negotiationContents)
          .reverse()
          .map((key) => {
            return negotiationContents[key];
          })}
      </TreeView>
    </Typography>
  );
});

export default NegotiationsPanel;
