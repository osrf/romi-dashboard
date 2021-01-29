import { Fade, makeStyles } from '@material-ui/core';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { adapterDoorRequests, adapterLiftRequests, toRosTime } from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React from 'react';
import {
  createSpotlightRef,
  defaultDict,
  DispenserAccordion as DispenserAccordion_,
  DoorAccordion as DoorAccordion_,
  LiftAccordion as LiftAccordion_,
  LiftAccordionProps,
  OmniPanel,
  OmniPanelView,
  RobotAccordion as RobotAccordion_,
  StackNavigator,
  withSpotlight,
} from 'react-components';
import { GlobalHotKeys } from 'react-hotkeys';
import 'typeface-roboto';
import { buildHotKeys } from '../../hotkeys';
import { NegotiationTrajectoryResponse } from '../../managers/negotiation-status-manager';
import { AppControllerContext, ResourcesContext } from '../app-contexts';
import {
  BuildingMapContext,
  DispenserStateContext,
  DoorStateContext,
  FleetStateContext,
  LiftStateContext,
  NegotiationStatusContext,
  RmfIngressContext,
  TasksContext,
  TransportContext,
} from '../rmf-app';
import ScheduleVisualizer, { ScheduleVisualizerProps } from '../schedule-visualizer';
import { SpotlightValue } from '../spotlight-value';
import TaskSummaryPanel from './task-summary-panel';
import CommandsPanel from './commands-panel';
import MainMenu from './main-menu';
import NegotiationsPanel from './negotiations-panel';
import OmniPanelControl_ from './omnipanel-control';
import { DashboardState, useDashboardReducer } from './reducers/dashboard-reducer';
import { DispenserResource } from '../../managers/resource-manager-dispensers';

const debug = Debug('Dashboard');
const DispenserAccordion = React.memo(withSpotlight(DispenserAccordion_));
const DoorAccordion = React.memo(withSpotlight(DoorAccordion_));
const LiftAccordion = React.memo(withSpotlight(LiftAccordion_));
const RobotAccordion = React.memo(withSpotlight(RobotAccordion_));
const OmniPanelControl = React.memo(OmniPanelControl_);

const borderRadius = 20;

export enum OmniPanelViewIndex {
  MainMenu = 0,
  Doors,
  Lifts,
  Robots,
  Dispensers,
  Commands,
  Negotiations,
  Tasks,
}

export const dashboardInitialValues: DashboardState = {
  showOmniPanel: true,
  currentView: 0,
  stackNavigator: new StackNavigator<OmniPanelViewIndex>(OmniPanelViewIndex.MainMenu),
};

const useStyles = makeStyles((theme) => ({
  toolBarTitle: {
    flexGrow: 1,
  },
  omniPanel: {
    '@media (min-aspect-ratio: 8/10)': {
      position: 'fixed',
      width: 350,
      top: 80,
      right: '1%',
      bottom: '2%',
      backgroundColor: theme.palette.background.default,
      // put it above leaflet panes, https://leafletjs.com/reference-1.6.0.html#map-pane
      zIndex: 610,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      boxShadow: theme.shadows[12],
    },
    '@media (max-aspect-ratio: 8/10)': {
      position: 'absolute',
      width: '100%',
      height: '35%',
      top: '65%',
      backgroundColor: theme.palette.background.default,
      // put it above leaflet panes, https://leafletjs.com/reference-1.6.0.html#map-pane
      zIndex: 610,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      boxShadow: theme.shadows[12],
    },
  },
}));

function robotKey(fleet: string, robot: RomiCore.RobotState): string {
  return `${fleet}-${robot.name}`;
}

export default function Dashboard(_props: {}): React.ReactElement {
  debug('render');

  const classes = useStyles();

  const appController = React.useContext(AppControllerContext);

  const transport = React.useContext(TransportContext);
  const buildingMap = React.useContext(BuildingMapContext);
  const resourceManager = React.useContext(ResourcesContext);

  const { state: dashboardState, dispatch: dashboardDispatch } = useDashboardReducer(
    dashboardInitialValues,
  );

  const { currentView, showOmniPanel, stackNavigator } = dashboardState;

  const { setCurrentView, setShowOmniPanel, resetView, popView, pushView } = dashboardDispatch;

  const mapFloorSort = React.useCallback(
    (levels: RomiCore.Level[]) =>
      levels.sort((a, b) => a.elevation - b.elevation).map((x) => x.name),
    [],
  );
  const mapFloorLayerSorted = React.useMemo(
    () => (buildingMap ? mapFloorSort(buildingMap.levels) : undefined),
    [buildingMap, mapFloorSort],
  );

  const handleOmniPanelClose = React.useCallback(() => {
    clearSpotlights();
    setNegotiationTrajStore({});
    resetView();
    setShowOmniPanel(false);
  }, [resetView, setShowOmniPanel]);

  const handleOmniPanelBack = React.useCallback(() => {
    clearSpotlights();
    if (stackNavigator.stack.length === 1) {
      return handleOmniPanelClose();
    } else {
      setNegotiationTrajStore({});
    }
    popView();
  }, [stackNavigator, handleOmniPanelClose, popView]);

  const handleOmniPanelHome = React.useCallback(() => {
    clearSpotlights();
    setNegotiationTrajStore({});
    resetView();
    setCurrentView(stackNavigator.top());
  }, [resetView, setCurrentView, stackNavigator]);

  const doorStates = React.useContext(DoorStateContext);
  const doors = React.useMemo(
    () => (buildingMap ? buildingMap.levels.flatMap((x) => x.doors) : []),
    [buildingMap],
  );
  const doorAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleDoorMarkerClick = React.useCallback(
    (door: RomiCore.Door) => {
      setShowOmniPanel(true);
      pushView(OmniPanelViewIndex.Doors);
      doorAccordionRefs[door.name].spotlight();
    },
    [doorAccordionRefs, pushView, setShowOmniPanel],
  );

  const liftStates = React.useContext(LiftStateContext);
  const lifts = React.useMemo(() => (buildingMap ? buildingMap.lifts : []), [buildingMap]);
  const liftAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleLiftMarkerClick = React.useCallback(
    (lift: RomiCore.Lift) => {
      setShowOmniPanel(true);
      pushView(OmniPanelViewIndex.Lifts);
      liftAccordionRefs[lift.name].spotlight();
    },
    [liftAccordionRefs, pushView, setShowOmniPanel],
  );

  const dispenserStates = React.useContext(DispenserStateContext);
  const dispenserAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleDispenserMarkerClick = React.useCallback<
    Required<ScheduleVisualizerProps>['onDispenserClick']
  >(
    (_, guid) => {
      setShowOmniPanel(true);
      pushView(OmniPanelViewIndex.Dispensers);
      dispenserAccordionRefs[guid].spotlight();
    },
    [dispenserAccordionRefs, pushView, setShowOmniPanel],
  );
  let dispensers: Record<string, DispenserResource> | undefined;
  if (resourceManager && resourceManager.dispensers) {
    dispensers = resourceManager.dispensers.dispensers;
  }

  const fleetStates = React.useContext(FleetStateContext);
  const fleets = React.useMemo(() => Object.values(fleetStates), [fleetStates]);
  const fleetNames = React.useRef<string[]>([]);
  const newFleetNames = Object.keys(fleetStates);
  if (newFleetNames.some((fleetName) => !fleetNames.current.includes(fleetName))) {
    fleetNames.current = newFleetNames;
  }
  const robotAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleRobotMarkerClick = React.useCallback(
    (fleet: string, robot: RomiCore.RobotState) => {
      setShowOmniPanel(true);
      pushView(OmniPanelViewIndex.Robots);
      robotAccordionRefs[robotKey(fleet, robot)].spotlight();
    },
    [robotAccordionRefs, pushView, setShowOmniPanel],
  );

  const { negotiationStatusManager } = React.useContext(RmfIngressContext);
  const negotiationStatus = React.useContext(NegotiationStatusContext);
  const [negotiationSpotlight, setNegotiationSpotlight] = React.useState<
    SpotlightValue<string> | undefined
  >(undefined);
  const [negotiationTrajStore, setNegotiationTrajStore] = React.useState<
    Record<string, NegotiationTrajectoryResponse>
  >({});
  const statusUpdateTS = React.useRef<number>();
  statusUpdateTS.current = negotiationStatusManager.getLastUpdateTS();

  const tasks = React.useContext(TasksContext);

  const doorRequestPub = React.useMemo(() => transport?.createPublisher(adapterDoorRequests), [
    transport,
  ]);
  const handleOnDoorControlClick = React.useCallback(
    (_ev, door: RomiCore.Door, mode: number) =>
      doorRequestPub?.publish({
        door_name: door.name,
        request_time: RomiCore.toRosTime(new Date()),
        requested_mode: { value: mode },
        requester_id: 'dashboard',
      }),
    [doorRequestPub],
  );

  const liftRequestPub = React.useMemo(() => transport?.createPublisher(adapterLiftRequests), [
    transport,
  ]);
  const handleLiftRequestSubmit = React.useCallback<
    Required<LiftAccordionProps>['onRequestSubmit']
  >(
    (_ev, lift, doorState, requestType, destination) =>
      liftRequestPub?.publish({
        lift_name: lift.name,
        destination_floor: destination,
        door_state: doorState,
        request_type: requestType,
        request_time: toRosTime(new Date()),
        session_id: 'dashboard',
      }),
    [liftRequestPub],
  );

  function clearSpotlights() {
    setNegotiationSpotlight(undefined);
  }

  const hotKeysValue = React.useMemo(
    () => buildHotKeys({ reducerDashboardDispatch: dashboardDispatch, appController }),
    [dashboardDispatch, appController],
  );

  return (
    <GlobalHotKeys keyMap={hotKeysValue.keyMap} handlers={hotKeysValue.handlers}>
      {buildingMap && (
        <>
          <ScheduleVisualizer
            buildingMap={buildingMap}
            mapFloorSort={mapFloorSort}
            negotiationTrajStore={negotiationTrajStore}
            onDoorClick={handleDoorMarkerClick}
            onLiftClick={handleLiftMarkerClick}
            onRobotClick={handleRobotMarkerClick}
            onDispenserClick={handleDispenserMarkerClick}
          >
            <OmniPanelControl show={!showOmniPanel} dashboardDispatch={dashboardDispatch} />
          </ScheduleVisualizer>
        </>
      )}
      <Fade in={showOmniPanel}>
        <OmniPanel
          className={classes.omniPanel}
          view={currentView}
          variant="backHomeClose"
          onBack={handleOmniPanelBack}
          onHome={handleOmniPanelHome}
          onClose={handleOmniPanelClose}
        >
          <OmniPanelView viewId={OmniPanelViewIndex.MainMenu}>
            <MainMenu pushView={pushView} />
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Doors}>
            {doors.map((door) => (
              <DoorAccordion
                key={door.name}
                ref={doorAccordionRefs[door.name].ref}
                door={door}
                doorState={doorStates[door.name]}
                onDoorControlClick={handleOnDoorControlClick}
                data-name={door.name}
              />
            ))}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Lifts}>
            {lifts.map((lift) => (
              <LiftAccordion
                key={lift.name}
                ref={liftAccordionRefs[lift.name].ref}
                lift={lift}
                liftState={liftStates[lift.name]}
                onRequestSubmit={handleLiftRequestSubmit}
              />
            ))}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Robots}>
            {fleets.flatMap((fleet) =>
              fleet.robots.map((robot) => (
                <RobotAccordion
                  key={robotKey(fleet.name, robot)}
                  ref={robotAccordionRefs[robotKey(fleet.name, robot)].ref}
                  robot={robot}
                  fleetName={fleet.name}
                  data-component="RobotAccordion"
                />
              )),
            )}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Dispensers}>
            {dispensers
              ? Object.keys(dispensers).map((dispenser) => (
                  <DispenserAccordion
                    key={dispenser}
                    ref={
                      dispenserStates[dispenser]
                        ? dispenserAccordionRefs[dispenserStates[dispenser].guid].ref
                        : null
                    }
                    dispenserState={dispenserStates[dispenser] ? dispenserStates[dispenser] : null}
                    data-component="DispenserAccordion"
                    dispenser={dispenser}
                  />
                ))
              : null}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Commands}>
            {transport && <CommandsPanel transport={transport} allFleets={fleetNames.current} />}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Negotiations}>
            <NegotiationsPanel
              conflicts={negotiationStatus}
              spotlight={negotiationSpotlight}
              mapFloorLayerSorted={mapFloorLayerSorted}
              negotiationStatusManager={negotiationStatusManager}
              negotiationTrajStore={negotiationTrajStore}
              negotiationStatusUpdateTS={statusUpdateTS.current}
              setNegotiationTrajStore={setNegotiationTrajStore}
            />
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Tasks}>
            <TaskSummaryPanel tasks={tasks} />
          </OmniPanelView>
        </OmniPanel>
      </Fade>
    </GlobalHotKeys>
  );
}
