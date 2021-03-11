import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import DispenserStateManager from '../../managers/dispenser-state-manager';
import DoorStateManager from '../../managers/door-state-manager';
import FleetManager from '../../managers/fleet-manager';
import LiftStateManager from '../../managers/lift-state-manager';
import { NegotiationStatusManager } from '../../managers/negotiation-status-manager';
import TaskManager from '../../managers/task-manager';
import { AppConfigContext, AppControllerContext } from '../app-contexts';
import {
  BuildingMapContext,
  DispenserStateContext,
  DoorStateContext,
  FleetStateContext,
  LiftStateContext,
  NegotiationStatusContext,
  RmfIngress,
  RmfIngressContext,
  TasksContext,
  TransportContext,
} from './contexts';

enum ConnectionState {
  Connected,
  Disconnected,
  Connecting,
}

function TransportContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const appConfig = React.useContext(AppConfigContext);
  const [transport, setTransport] = React.useState<RomiCore.Transport | null>(null);
  const { showLoadingScreen } = React.useContext(AppControllerContext);
  const [connectionState, setConnectionState] = React.useState(() =>
    transport ? ConnectionState.Connected : ConnectionState.Disconnected,
  );
  const [error, setError] = React.useState<CloseEvent | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setConnectionState(ConnectionState.Connecting);
        setTransport(await appConfig.transportFactory());
        setConnectionState(ConnectionState.Connected);
      } catch (e) {
        console.error(e);
        setError(e);
        setConnectionState(ConnectionState.Disconnected);
      }
    })();
  }, [appConfig]);

  React.useEffect(() => {
    switch (connectionState) {
      case ConnectionState.Connecting:
        showLoadingScreen({ caption: 'Connecting to server...' });
        break;
      case ConnectionState.Disconnected:
        if (error) {
          showLoadingScreen({
            caption: `Unable to connect to server (${error.code})`,
            variant: 'error',
          });
        } else {
          showLoadingScreen({
            caption: `Unable to connect to server (unknown error)`,
            variant: 'error',
          });
        }
        break;
    }
  }, [connectionState, error, showLoadingScreen]);

  return <TransportContext.Provider value={transport}>{props.children}</TransportContext.Provider>;
}

function BuildingMapProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const transport = React.useContext(TransportContext);
  const [buildingMap, setBuildingMap] = React.useState<RomiCore.BuildingMap | null>(null);
  const { showLoadingScreen } = React.useContext(AppControllerContext);
  const downloadingRef = React.useRef(false);

  React.useEffect(() => {
    if (buildingMap || !transport || downloadingRef.current) {
      return;
    }
    (async () => {
      downloadingRef.current = true;
      showLoadingScreen({ caption: 'Downloading building map...' });
      const resp = await transport.call(RomiCore.getBuildingMap, {});
      downloadingRef.current = false;
      showLoadingScreen({});
      setBuildingMap(resp.building_map);
    })();
  }, [buildingMap, transport, downloadingRef, showLoadingScreen]);

  return (
    <BuildingMapContext.Provider value={buildingMap}>{props.children}</BuildingMapContext.Provider>
  );
}

function DispenserContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const transport = React.useContext(TransportContext);
  const { dispenserStateManager } = React.useContext(RmfIngressContext);
  const [dispenserStates, setDispenserStates] = React.useState(() => ({
    ...dispenserStateManager.dispenserStates,
  }));

  React.useEffect(() => {
    if (transport) {
      dispenserStateManager.startSubscription(transport);
    }
    const onUpdated = () => setDispenserStates({ ...dispenserStateManager.dispenserStates });
    dispenserStateManager.on('updated', onUpdated);

    return () => {
      dispenserStateManager.off('updated', onUpdated);
    };
  }, [transport, dispenserStateManager]);

  return (
    <DispenserStateContext.Provider value={dispenserStates}>
      {props.children}
    </DispenserStateContext.Provider>
  );
}

function DoorContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const transport = React.useContext(TransportContext);
  const { doorStateManager } = React.useContext(RmfIngressContext);
  const [doorStates, setDoorStates] = React.useState(() => ({ ...doorStateManager.doorStates }));

  React.useEffect(() => {
    if (transport) {
      doorStateManager.startSubscription(transport);
    }
    const onUpdated = () => setDoorStates({ ...doorStateManager.doorStates });
    doorStateManager.on('updated', onUpdated);

    return () => {
      doorStateManager.off('updated', onUpdated);
    };
  }, [transport, doorStateManager]);

  return <DoorStateContext.Provider value={doorStates}>{props.children}</DoorStateContext.Provider>;
}

function FleetContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const transport = React.useContext(TransportContext);
  const { fleetManager } = React.useContext(RmfIngressContext);
  const [fleetStates, setFleetStates] = React.useState(() => ({
    ...fleetManager.fleetStates,
  }));

  React.useEffect(() => {
    if (transport) {
      fleetManager.startSubscription(transport);
    }
    const onUpdated = () => setFleetStates({ ...fleetManager.fleetStates });
    fleetManager.on('updated', onUpdated);

    return () => {
      fleetManager.off('updated', onUpdated);
    };
  }, [transport, fleetManager]);

  return (
    <FleetStateContext.Provider value={fleetStates}>{props.children}</FleetStateContext.Provider>
  );
}

function LiftContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const transport = React.useContext(TransportContext);
  const { liftStateManager } = React.useContext(RmfIngressContext);
  const [liftStates, setLiftStates] = React.useState(() => ({ ...liftStateManager.liftStates }));

  React.useEffect(() => {
    if (transport) {
      liftStateManager.startSubscription(transport);
    }
    const onUpdated = () => setLiftStates({ ...liftStateManager.liftStates });
    liftStateManager.on('updated', onUpdated);

    return () => {
      liftStateManager.off('updated', onUpdated);
    };
  }, [transport, liftStateManager]);

  return <LiftStateContext.Provider value={liftStates}>{props.children}</LiftStateContext.Provider>;
}

function NegotiationContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { negotiationStatusManager } = React.useContext(RmfIngressContext);
  const [negotiationStatus, setNegotiationStatus] = React.useState(
    negotiationStatusManager.allConflicts(),
  );

  React.useEffect(() => {
    negotiationStatusManager.startSubscription();
    const onUpdated = () => setNegotiationStatus(negotiationStatusManager.allConflicts());
    negotiationStatusManager.on('updated', onUpdated);

    return () => {
      negotiationStatusManager.off('updated', onUpdated);
    };
  }, [negotiationStatusManager]);

  return (
    <NegotiationStatusContext.Provider value={negotiationStatus}>
      {props.children}
    </NegotiationStatusContext.Provider>
  );
}

function TaskContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const transport = React.useContext(TransportContext);
  const { taskManager } = React.useContext(RmfIngressContext);
  const [tasks, setTasks] = React.useState(() => [...Object.values(taskManager.tasks)]);

  React.useEffect(() => {
    if (transport) {
      taskManager.startSubscription(transport);
    }
    const onUpdated = () => setTasks([...Object.values(taskManager.tasks)]);
    taskManager.on('updated', onUpdated);

    return () => {
      taskManager.off('updated', onUpdated);
    };
  }, [transport, taskManager]);

  return <TasksContext.Provider value={tasks}>{props.children}</TasksContext.Provider>;
}

function RmfIngressProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const appConfig = React.useContext(AppConfigContext);
  const [rmfIngress, setRmfIngress] = React.useState<RmfIngress>(() => ({
    dispenserStateManager: new DispenserStateManager(),
    doorStateManager: new DoorStateManager(),
    fleetManager: new FleetManager(),
    liftStateManager: new LiftStateManager(),
    negotiationStatusManager: new NegotiationStatusManager(appConfig.trajServerUrl),
    taskManager: new TaskManager(),
  }));

  // add loading screen if this takes very long
  React.useEffect(() => {
    const { trajectoryManagerFactory } = appConfig;
    if (!trajectoryManagerFactory) {
      return;
    }
    (async () => {
      const trajectoryManager = await trajectoryManagerFactory();
      setRmfIngress((prev) => ({
        ...prev,
        trajectoryManager,
      }));
    })();
  }, [appConfig]);

  return (
    <RmfIngressContext.Provider value={rmfIngress}>{props.children}</RmfIngressContext.Provider>
  );
}

export interface RmfAppProps extends React.PropsWithChildren<{}> {}

/**
 * Provides the following contexts:
 *
 * - BuildingMapContext
 * - DispenserStateContext
 * - DoorStateContext
 * - FleetStateContext
 * - LiftStateContext
 * - NegotiationStatusContext
 * - RmfIngressContext
 * - TasksContext
 * - TransportContext
 */
export function RmfApp(props: RmfAppProps): JSX.Element {
  return (
    <TransportContextsProvider>
      <RmfIngressProvider>
        <BuildingMapProvider>
          <DoorContextsProvider>
            <LiftContextsProvider>
              <DispenserContextsProvider>
                <FleetContextsProvider>
                  <NegotiationContextsProvider>
                    <TaskContextsProvider>{props.children}</TaskContextsProvider>
                  </NegotiationContextsProvider>
                </FleetContextsProvider>
              </DispenserContextsProvider>
            </LiftContextsProvider>
          </DoorContextsProvider>
        </BuildingMapProvider>
      </RmfIngressProvider>
    </TransportContextsProvider>
  );
}
