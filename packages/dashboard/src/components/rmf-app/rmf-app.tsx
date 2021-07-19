import { Fleet } from 'api-client';
import React from 'react';
import * as RmfModels from 'rmf-models';
import appConfig from '../../app-config';
import RmfHealthStateManager from '../../managers/rmf-health-state-manager';
import { AppConfigContext } from '../app-contexts';
import { User, UserContext } from '../auth/contexts';
import {
  BuildingMapContext,
  DispenserStateContext,
  DoorStateContext,
  FleetStateContext,
  IngestorStateContext,
  LiftStateContext,
  NegotiationStatusContext,
  PlacesContext,
  RmfHealthContext,
  RmfIngressContext,
} from './contexts';
import { RmfIngress } from './rmf-ingress';
import { getPlaces } from './utils';

function RmfPlacesContextsProvider({ children }: React.PropsWithChildren<unknown>): JSX.Element {
  const buildingMap = React.useContext(BuildingMapContext);
  const places = React.useMemo(() => {
    if (!buildingMap) {
      return [];
    }
    return getPlaces(buildingMap);
  }, [buildingMap]);

  return <PlacesContext.Provider value={places}>{children}</PlacesContext.Provider>;
}

function BuildingMapProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient } = React.useContext(RmfIngressContext) || {};
  const [buildingMap, setBuildingMap] = React.useState<RmfModels.BuildingMap | null>(null);

  React.useEffect(() => {
    if (!sioClient) {
      return;
    }
    sioClient.subscribeBuildingMap(setBuildingMap);

    // TODO: unsubscribe
  }, [sioClient]);

  return (
    <BuildingMapContext.Provider value={buildingMap}>
      <RmfPlacesContextsProvider>{props.children}</RmfPlacesContextsProvider>
    </BuildingMapContext.Provider>
  );
}

function DoorContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, doorsApi } = React.useContext(RmfIngressContext) || {};
  const [doorStates, setDoorStates] = React.useState<Record<string, RmfModels.DoorState>>({});

  React.useEffect(() => {
    (async () => {
      if (!sioClient || !doorsApi) {
        return;
      }
      const doors = (await doorsApi.getDoorsDoorsGet()).data;
      doors.forEach((door) => {
        sioClient.subscribeDoorState(door.name, (state) =>
          setDoorStates((prev) => ({ ...prev, [state.door_name]: state })),
        );
      });
    })();

    // TODO: unsubscribe
  }, [sioClient, doorsApi]);

  return <DoorStateContext.Provider value={doorStates}>{props.children}</DoorStateContext.Provider>;
}

function LiftContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, liftsApi } = React.useContext(RmfIngressContext) || {};
  const [liftStates, setLiftStates] = React.useState<Record<string, RmfModels.LiftState>>({});

  React.useEffect(() => {
    (async () => {
      if (!sioClient || !liftsApi) {
        return;
      }
      const lifts = (await liftsApi.getLiftsLiftsGet()).data;
      lifts.forEach((lift) => {
        sioClient.subscribeLiftState(lift.name, (state) =>
          setLiftStates((prev) => ({ ...prev, [state.lift_name]: state })),
        );
      });
    })();

    // TODO: unsubscribe
  }, [sioClient, liftsApi]);

  return <LiftStateContext.Provider value={liftStates}>{props.children}</LiftStateContext.Provider>;
}

function DispenserContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, dispensersApi } = React.useContext(RmfIngressContext) || {};
  const [dispenserStates, setDispenserStates] = React.useState<
    Record<string, RmfModels.DispenserState>
  >({});

  React.useEffect(() => {
    (async () => {
      if (!sioClient || !dispensersApi) {
        return;
      }
      const dispensers = (await dispensersApi.getDispensersDispensersGet()).data;
      dispensers.forEach((dispenser) => {
        sioClient.subscribeDispenserState(dispenser.guid, (state) =>
          setDispenserStates((prev) => ({ ...prev, [state.guid]: state })),
        );
      });
    })();

    // TODO: unsubscribe
  }, [sioClient, dispensersApi]);

  return (
    <DispenserStateContext.Provider value={dispenserStates}>
      {props.children}
    </DispenserStateContext.Provider>
  );
}

function IngestorContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, ingestorsApi } = React.useContext(RmfIngressContext) || {};
  const [ingestorStates, setIngestorStates] = React.useState<
    Record<string, RmfModels.IngestorState>
  >({});

  React.useEffect(() => {
    (async () => {
      if (!sioClient || !ingestorsApi) {
        return;
      }
      const ingestors = (await ingestorsApi.getIngestorsIngestorsGet()).data;
      ingestors.forEach((ingestor) => {
        sioClient.subscribeIngestorState(ingestor.guid, (state) =>
          setIngestorStates((prev) => ({ ...prev, [state.guid]: state })),
        );
      });
    })();

    // TODO: unsubscribe
  }, [sioClient, ingestorsApi]);

  return (
    <IngestorStateContext.Provider value={ingestorStates}>
      {props.children}
    </IngestorStateContext.Provider>
  );
}

function FleetContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, fleetsApi } = React.useContext(RmfIngressContext) || {};
  const [fleetStates, setFleetStates] = React.useState<Record<string, RmfModels.FleetState>>({});

  React.useEffect(() => {
    (async () => {
      if (!sioClient || !fleetsApi) {
        return;
      }
      const fleets = (await fleetsApi.getFleetsFleetsGet()).data;
      fleets.forEach((fleet: Fleet) => {
        sioClient.subscribeFleetState(fleet.name, (state) =>
          setFleetStates((prev) => ({ ...prev, [state.name]: state })),
        );
      });
    })();

    // TODO: unsubscribe
  }, [sioClient, fleetsApi]);

  return (
    <FleetStateContext.Provider value={fleetStates}>{props.children}</FleetStateContext.Provider>
  );
}

function NegotiationContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { negotiationStatusManager } = React.useContext(RmfIngressContext) || {};
  const [negotiationStatus, setNegotiationStatus] = React.useState(
    negotiationStatusManager?.allConflicts() || {},
  );

  const authenticator = React.useContext(AppConfigContext).authenticator;

  React.useEffect(() => {
    if (!negotiationStatusManager) {
      return;
    }
    negotiationStatusManager.startSubscription(authenticator.token);
    const onUpdated = () => setNegotiationStatus(negotiationStatusManager.allConflicts());
    negotiationStatusManager.on('updated', onUpdated);

    return () => {
      negotiationStatusManager.off('updated', onUpdated);
    };
  }, [negotiationStatusManager, authenticator]);

  return (
    <NegotiationStatusContext.Provider value={negotiationStatus}>
      {props.children}
    </NegotiationStatusContext.Provider>
  );
}

function RmfHealthContextsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const healthManager = React.useMemo(() => new RmfHealthStateManager(), []);

  return (
    <RmfHealthContext.Provider value={healthManager.getHealthStatus()}>
      {props.children}
    </RmfHealthContext.Provider>
  );
}

function RmfIngressProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const authenticator = appConfig.authenticator;
  const [rmfIngress, setRmfIngress] = React.useState<RmfIngress | undefined>(() => {
    if (authenticator.user) {
      return new RmfIngress();
    } else {
      authenticator.once('userChanged', () => setRmfIngress(new RmfIngress()));
      return undefined;
    }
  });

  return (
    <RmfIngressContext.Provider value={rmfIngress}>{props.children}</RmfIngressContext.Provider>
  );
}

function UserProvider(props: React.PropsWithChildren<{}>) {
  const rmfIngress = React.useContext(RmfIngressContext);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (!rmfIngress) {
      return;
    }
    let cancel = false;
    (async () => {
      const getUserResp = await rmfIngress.defaultApi.getUserUserGet();
      const getPermResp = await rmfIngress.defaultApi.getEffectivePermissionsPermissionsGet();
      if (cancel) {
        return;
      }
      setUser({
        profile: getUserResp.data,
        permissions: getPermResp.data,
      });
    })();
    return () => {
      cancel = true;
    };
  }, [rmfIngress]);

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
}

export interface RmfAppProps extends React.PropsWithChildren<{}> {}

/**
 * Provides the following contexts:
 *
 * - UserProfileContext
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
    <RmfIngressProvider>
      <UserProvider>
        <BuildingMapProvider>
          <DoorContextsProvider>
            <LiftContextsProvider>
              <DispenserContextsProvider>
                <IngestorContextsProvider>
                  <FleetContextsProvider>
                    <NegotiationContextsProvider>
                      <RmfHealthContextsProvider>{props.children}</RmfHealthContextsProvider>
                    </NegotiationContextsProvider>
                  </FleetContextsProvider>
                </IngestorContextsProvider>
              </DispenserContextsProvider>
            </LiftContextsProvider>
          </DoorContextsProvider>
        </BuildingMapProvider>
      </UserProvider>
    </RmfIngressProvider>
  );
}
