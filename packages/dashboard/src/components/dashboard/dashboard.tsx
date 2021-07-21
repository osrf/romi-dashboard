import { Fade, makeStyles } from '@material-ui/core';
import { Fleet, Level } from 'api-client';
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
  OnChangeEvent,
  RobotAccordion as RobotAccordion_,
  SimpleFilter,
  useStackNavigator,
  withSpotlight,
} from 'react-components';
import { GlobalHotKeys } from 'react-hotkeys';
import * as RmfModels from 'rmf-models';
import appConfig from '../../app-config';
import { buildHotKeys } from '../../hotkeys';
import {
  NegotiationConflict,
  NegotiationTrajectoryResponse,
} from '../../managers/negotiation-status-manager';
import { AppControllerContext } from '../app-contexts';
import { DispensersContext, RmfIngressContext } from '../rmf-app';
import ScheduleVisualizer, { ScheduleVisualizerProps } from '../schedule-visualizer';
import { RobotsOverlayProps } from '../schedule-visualizer/robots-overlay';
import { SpotlightValue } from '../spotlight-value';
import MainMenu from './main-menu';
import NegotiationsPanel from './negotiations-panel';
import OmniPanelControl_ from './omnipanel-control';
import { DashboardState, useDashboardReducer } from './reducers/dashboard-reducer';

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
  Negotiations,
}

export const dashboardInitialValues: DashboardState = {
  showOmniPanel: true,
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

function robotKey(fleet: string, robotName: string): string {
  return `${fleet}-${robotName}`;
}

const initialStack = [OmniPanelViewIndex.MainMenu];

export default function Dashboard(_props: {}): React.ReactElement {
  debug('render');

  const classes = useStyles();

  const appController = React.useContext(AppControllerContext);
  const rmfIngress = React.useContext(RmfIngressContext);
  const sioClient = rmfIngress?.sioClient;

  const [buildingMap, setBuildingMap] = React.useState<RmfModels.BuildingMap | null>(null);
  React.useEffect(() => {
    if (!sioClient) return;
    sioClient.subscribeBuildingMap(setBuildingMap);
    return () => sioClient.unsubscribe(setBuildingMap);
  }, [sioClient]);

  const { state: dashboardState, dispatch: dashboardDispatch } = useDashboardReducer(
    dashboardInitialValues,
  );

  const [viewStack, viewStackDispatch] = useStackNavigator<OmniPanelViewIndex>(
    initialStack,
    OmniPanelViewIndex.MainMenu,
  );
  const currentView = viewStack[viewStack.length - 1];

  const { showOmniPanel } = dashboardState;
  const { setShowOmniPanel } = dashboardDispatch;

  const mapFloorSort = React.useCallback(
    (levels: RmfModels.Level[]) =>
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
    viewStackDispatch.reset();
    setShowOmniPanel(false);
    setFilter('');
  }, [setShowOmniPanel, viewStackDispatch]);

  const handleOmniPanelBack = React.useCallback(() => {
    clearSpotlights();
    setFilter('');
    if (viewStack.length === 1) {
      return handleOmniPanelClose();
    } else {
      setNegotiationTrajStore({});
    }
    viewStackDispatch.pop();
  }, [handleOmniPanelClose, viewStackDispatch, viewStack]);

  const handleOmniPanelHome = React.useCallback(() => {
    clearSpotlights();
    setNegotiationTrajStore({});
    viewStackDispatch.reset();
    setFilter('');
  }, [viewStackDispatch]);

  const [doorStates, setDoorStates] = React.useState<Record<string, RmfModels.DoorState>>({});
  const doors: RmfModels.Door[] = React.useMemo(
    () => (buildingMap ? (buildingMap.levels as Level[]).flatMap((x) => x.doors) : []),
    [buildingMap],
  );
  React.useEffect(() => {
    if (!sioClient) return;
    const subs = doors.map((d) =>
      sioClient.subscribeDoorState(d.name, (state) =>
        setDoorStates((prev) => ({ ...prev, [d.name]: state })),
      ),
    );
    return () => {
      subs.forEach((s) => sioClient.unsubscribe(s));
    };
  }, [sioClient, doors]);
  const doorAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleDoorMarkerClick = React.useCallback(
    (door: RmfModels.Door) => {
      setShowOmniPanel(true);
      viewStackDispatch.push(OmniPanelViewIndex.Doors);
      doorAccordionRefs[door.name].spotlight();
      setFilter('');
    },
    [doorAccordionRefs, viewStackDispatch, setShowOmniPanel],
  );

  const [liftStates, setLiftStates] = React.useState<Record<string, RmfModels.LiftState>>({});
  const lifts: RmfModels.Lift[] = React.useMemo(() => (buildingMap ? buildingMap.lifts : []), [
    buildingMap,
  ]);
  React.useEffect(() => {
    if (!sioClient) return;
    const subs = lifts.map((l) =>
      sioClient.subscribeLiftState(l.name, (state) =>
        setLiftStates((prev) => ({ ...prev, [l.name]: state })),
      ),
    );
    return () => {
      subs.forEach((s) => sioClient.unsubscribe(s));
    };
  }, [sioClient, lifts]);
  const liftAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleLiftMarkerClick = React.useCallback(
    (lift: RmfModels.Lift) => {
      setShowOmniPanel(true);
      viewStackDispatch.push(OmniPanelViewIndex.Lifts);
      liftAccordionRefs[lift.name].spotlight();
      setFilter('');
    },
    [liftAccordionRefs, viewStackDispatch, setShowOmniPanel],
  );

  const dispensers = React.useContext(DispensersContext);
  const [dispenserStates, setDispenserStates] = React.useState<
    Record<string, RmfModels.DispenserState>
  >({});
  React.useEffect(() => {
    if (!sioClient) return;
    const subs = dispensers.map((d) =>
      sioClient.subscribeDispenserState(d.guid, (state) =>
        setDispenserStates((prev) => ({ ...prev, [d.guid]: state })),
      ),
    );
    return () => {
      subs.forEach((s) => sioClient.unsubscribe(s));
    };
  }, [sioClient, dispensers]);
  const dispenserAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleDispenserMarkerClick = React.useCallback<
    Required<ScheduleVisualizerProps>['onDispenserClick']
  >(
    (_, guid) => {
      setShowOmniPanel(true);
      viewStackDispatch.push(OmniPanelViewIndex.Dispensers);
      dispenserAccordionRefs[guid].spotlight();
      setFilter('');
    },
    [dispenserAccordionRefs, viewStackDispatch, setShowOmniPanel],
  );

  const [fleets, setFleets] = React.useState<Fleet[]>([]);
  React.useEffect(() => {
    if (!rmfIngress) return;
    let cancel = false;
    (async () => {
      const result = await rmfIngress.fleetsApi.getFleetsFleetsGet();
      if (cancel || result.status !== 200) return;
      setFleets(result.data);
    })();
    return () => {
      cancel = true;
    };
  }, [rmfIngress]);
  const [fleetStates, setFleetStates] = React.useState<Record<string, RmfModels.FleetState>>({});
  React.useEffect(() => {
    if (!sioClient) return;
    const subs = fleets.map((f) =>
      sioClient.subscribeFleetState(f.name, (state) =>
        setFleetStates((prev) => ({ ...prev, [f.name]: state })),
      ),
    );
    return () => {
      subs.forEach((s) => sioClient.unsubscribe(s));
    };
  }, [sioClient, fleets]);
  const fleetNames = React.useRef<string[]>([]);
  const newFleetNames = Object.keys(fleetStates);
  if (newFleetNames.some((fleetName) => !fleetNames.current.includes(fleetName))) {
    fleetNames.current = newFleetNames;
  }
  const robotAccordionRefs = React.useMemo(() => defaultDict(createSpotlightRef), []);
  const handleRobotMarkerClick = React.useCallback<Required<RobotsOverlayProps>['onRobotClick']>(
    (_ev, fleet, robot) => {
      setShowOmniPanel(true);
      viewStackDispatch.push(OmniPanelViewIndex.Robots);
      robotAccordionRefs[robotKey(fleet, robot)].spotlight();
      setFilter('');
    },
    [robotAccordionRefs, viewStackDispatch, setShowOmniPanel],
  );

  const { negotiationStatusManager } = React.useContext(RmfIngressContext) || {};
  const [negotiationStatus, setNegotiationStatus] = React.useState<
    Record<number, NegotiationConflict>
  >({});
  React.useEffect(() => {
    if (!negotiationStatusManager) {
      return;
    }
    negotiationStatusManager.startSubscription(appConfig.authenticator.token);
    const onUpdated = () => setNegotiationStatus(negotiationStatusManager.allConflicts());
    negotiationStatusManager.on('updated', onUpdated);
    // FIXME: unable to unsubscribe

    return () => {
      negotiationStatusManager.off('updated', onUpdated);
    };
  }, [negotiationStatusManager]);
  const [negotiationSpotlight, setNegotiationSpotlight] = React.useState<
    SpotlightValue<string> | undefined
  >(undefined);
  const [negotiationTrajStore, setNegotiationTrajStore] = React.useState<
    Record<string, NegotiationTrajectoryResponse>
  >({});
  const statusUpdateTS = React.useRef<number>();
  statusUpdateTS.current = negotiationStatusManager?.getLastUpdateTS() || -1;

  const { doorsApi, liftsApi } = React.useContext(RmfIngressContext) || {};

  const handleOnDoorControlClick = React.useCallback(
    (_ev, door: RmfModels.Door, mode: number) =>
      doorsApi?.postDoorRequestDoorsDoorNameRequestPost(
        {
          mode: mode,
        },
        door.name,
      ),
    [doorsApi],
  );

  const handleLiftRequestSubmit = React.useCallback<
    Required<LiftAccordionProps>['onRequestSubmit']
  >(
    (_ev, lift, doorState, requestType, destination) =>
      liftsApi?.postLiftRequestLiftsLiftNameRequestPost(
        {
          destination,
          request_type: requestType,
          door_mode: doorState,
        },
        lift.name,
      ),
    [liftsApi],
  );

  function clearSpotlights() {
    setNegotiationSpotlight(undefined);
  }

  const hotKeysValue = React.useMemo(
    () =>
      buildHotKeys({
        reducerDashboardDispatch: dashboardDispatch,
        viewStackDispatch,
        appController,
      }),
    [dashboardDispatch, viewStackDispatch, appController],
  );

  const [filter, setFilter] = React.useState('');

  const onChange = (e: React.ChangeEvent<OnChangeEvent>) => {
    setFilter(e.target.value.toLowerCase());
  };

  return (
    <GlobalHotKeys keyMap={hotKeysValue.keyMap} handlers={hotKeysValue.handlers}>
      {buildingMap && (
        <>
          <ScheduleVisualizer
            buildingMap={buildingMap}
            doorStates={doorStates}
            liftStates={liftStates}
            fleetStates={fleetStates}
            mapFloorSort={mapFloorSort}
            negotiationTrajStore={negotiationTrajStore}
            showTrajectories={!(currentView === OmniPanelViewIndex.Negotiations)}
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
          stack={viewStack}
          variant="backHomeClose"
          onBack={handleOmniPanelBack}
          onHome={handleOmniPanelHome}
          onClose={handleOmniPanelClose}
          id="omnipanel"
        >
          <OmniPanelView viewId={OmniPanelViewIndex.MainMenu}>
            <MainMenu pushView={viewStackDispatch.push} setFilter={() => setFilter('')} />
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Doors}>
            <SimpleFilter onChange={onChange} value={filter} />
            {doors.map((door) => {
              const toLower = door.name.toLowerCase();
              return toLower.includes(filter) ? (
                <DoorAccordion
                  key={door.name}
                  ref={doorAccordionRefs[door.name].ref}
                  door={door}
                  doorState={doorStates[door.name]}
                  onDoorControlClick={handleOnDoorControlClick}
                  data-name={door.name}
                />
              ) : null;
            })}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Lifts}>
            <SimpleFilter onChange={onChange} value={filter} />
            {lifts.map((lift) => {
              const toLower = lift.name.toLowerCase();
              return toLower.includes(filter) ? (
                <LiftAccordion
                  key={lift.name}
                  ref={liftAccordionRefs[lift.name].ref}
                  lift={lift}
                  liftState={liftStates[lift.name]}
                  onRequestSubmit={handleLiftRequestSubmit}
                />
              ) : null;
            })}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Robots}>
            <SimpleFilter onChange={onChange} value={filter} />
            {fleets.flatMap((fleet) =>
              (fleet.state.robots as RmfModels.RobotState[]).map((robot) => {
                const toLower = robot.name;
                return toLower.includes(filter) ? (
                  <RobotAccordion
                    key={robotKey(fleet.name, robot.name)}
                    ref={robotAccordionRefs[robotKey(fleet.name, robot.name)].ref}
                    robot={robot}
                    fleetName={fleet.name}
                    data-component="RobotAccordion"
                  />
                ) : null;
              }),
            )}
          </OmniPanelView>
          <OmniPanelView viewId={OmniPanelViewIndex.Dispensers}>
            <SimpleFilter onChange={onChange} value={filter} />
            {dispensers
              ? Object.keys(dispensers).map((dispenser) => {
                  const toLower = dispenser.toLowerCase();
                  return toLower.includes(filter) ? (
                    <DispenserAccordion
                      key={dispenser}
                      ref={dispenserAccordionRefs[dispenser].ref}
                      dispenserState={
                        dispenserStates[dispenser] ? dispenserStates[dispenser] : null
                      }
                      data-component="DispenserAccordion"
                      dispenser={dispenser}
                    />
                  ) : null;
                })
              : null}
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
        </OmniPanel>
      </Fade>
    </GlobalHotKeys>
  );
}
