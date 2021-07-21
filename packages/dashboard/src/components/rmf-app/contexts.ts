import { Dispenser, Fleet, Ingestor } from 'api-client';
import React from 'react';
import * as RmfModels from 'rmf-models';
import { HealthStatus } from '../../managers/rmf-health-state-manager';
import { Place } from './place';
import { RmfIngress } from './rmf-ingress';

export const BuildingMapContext = React.createContext<RmfModels.BuildingMap | null>(null);
export const PlacesContext = React.createContext<Place[]>([]);
export const FleetsContext = React.createContext<Fleet[]>([]);
export const DispensersContext = React.createContext<Dispenser[]>([]);
export const IngestorsContext = React.createContext<Ingestor[]>([]);

const itemSummary = () => {
  return {
    operational: 0,
    spoiltItem: [],
  };
};

const initializeItemSummary = itemSummary();

export const RmfHealthContext = React.createContext<HealthStatus>({
  door: { ...initializeItemSummary },
  lift: { ...initializeItemSummary },
  dispenser: { ...initializeItemSummary },
  robot: {
    operational: 0,
    idle: 0,
    charging: 0,
    spoiltRobots: [],
  },
});

export const RmfIngressContext = React.createContext<RmfIngress | undefined>(undefined);
