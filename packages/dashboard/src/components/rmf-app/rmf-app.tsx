import { Dispenser, Fleet, Ingestor } from 'api-client';
import React from 'react';
import * as RmfModels from 'rmf-models';
import appConfig from '../../app-config';
import RmfHealthStateManager from '../../managers/rmf-health-state-manager';
import { User, UserContext } from '../auth/contexts';
import {
  BuildingMapContext,
  DispensersContext,
  FleetsContext,
  IngestorsContext,
  PlacesContext,
  RmfHealthContext,
  RmfIngressContext,
} from './contexts';
import { RmfIngress } from './rmf-ingress';
import { getPlaces } from './utils';

function PlacesProvider({ children }: React.PropsWithChildren<unknown>): JSX.Element {
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
    const sub = sioClient.subscribeBuildingMap(setBuildingMap);

    return () => {
      sioClient.unsubscribe(sub);
    };
  }, [sioClient]);

  return (
    <BuildingMapContext.Provider value={buildingMap}>
      <PlacesProvider>{props.children}</PlacesProvider>
    </BuildingMapContext.Provider>
  );
}

function DispensersProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, dispensersApi } = React.useContext(RmfIngressContext) || {};
  const [dispensers, setDispensers] = React.useState<Dispenser[]>([]);

  React.useEffect(() => {
    if (!sioClient || !dispensersApi) {
      return;
    }
    let cancel = false;
    (async () => {
      const results = await dispensersApi.getDispensersDispensersGet();
      if (cancel || results.status !== 200) return;
      setDispensers(results.data);
    })();

    return () => {
      cancel = true;
    };
  }, [sioClient, dispensersApi]);

  return (
    <DispensersContext.Provider value={dispensers}>{props.children}</DispensersContext.Provider>
  );
}

function IngestorsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, ingestorsApi } = React.useContext(RmfIngressContext) || {};
  const [ingestors, setIngestors] = React.useState<Ingestor[]>([]);

  React.useEffect(() => {
    if (!sioClient || !ingestorsApi) {
      return;
    }
    let cancel = false;
    (async () => {
      const results = await ingestorsApi.getIngestorsIngestorsGet();
      if (cancel || results.status !== 200) return;
      setIngestors(results.data);
    })();

    return () => {
      cancel = true;
    };
  }, [sioClient, ingestorsApi]);

  return <IngestorsContext.Provider value={ingestors}>{props.children}</IngestorsContext.Provider>;
}

function FleetsProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const { sioClient, fleetsApi } = React.useContext(RmfIngressContext) || {};
  const [fleets, setFleets] = React.useState<Fleet[]>([]);

  React.useEffect(() => {
    if (!sioClient || !fleetsApi) {
      return;
    }
    let cancel = false;
    (async () => {
      const results = await fleetsApi.getFleetsFleetsGet();
      if (cancel || results.status !== 200) return;
      setFleets(results.data);
    })();

    return () => {
      cancel = true;
    };
  }, [sioClient, fleetsApi]);

  return <FleetsContext.Provider value={fleets}>{props.children}</FleetsContext.Provider>;
}

function RmfHealthProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  // FIXME: This does not listen for health events
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
 * - RmfIngressContext
 * - UserContext
 * - BuildingMapContext
 * - PlacesContext
 * - FleetsContext
 * - DispensersContext
 * - IngestorsContext
 * - RmfHealthContext
 *
 * TODO: Move non changing contexts like building map, places, fleets to `RmfIngress`.
 * Lazily fetch them and cache the results to improve initial load times.
 */
export function RmfApp(props: RmfAppProps): JSX.Element {
  return (
    <RmfIngressProvider>
      <UserProvider>
        <BuildingMapProvider>
          <FleetsProvider>
            <DispensersProvider>
              <IngestorsProvider>
                <RmfHealthProvider>{props.children}</RmfHealthProvider>
              </IngestorsProvider>
            </DispensersProvider>
          </FleetsProvider>
        </BuildingMapProvider>
      </UserProvider>
    </RmfIngressProvider>
  );
}
