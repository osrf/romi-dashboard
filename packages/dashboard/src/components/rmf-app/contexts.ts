import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import appConfig from '../../app-config';
import DispenserStateManager from '../../managers/dispenser-state-manager';
import DoorStateManager from '../../managers/door-state-manager';
import FleetManager from '../../managers/fleet-manager';
import LiftStateManager from '../../managers/lift-state-manager';
import { RobotTrajectoryManager } from '../../managers/robot-trajectory-manager';
import TaskManager from '../../managers/task-manager';
import {
  NegotiationConflict,
  NegotiationStatusManager,
} from '../../managers/negotiation-status-manager';

export const DispenserStateContext = React.createContext<Record<string, RomiCore.DispenserState>>(
  {},
);
export const DoorStateContext = React.createContext<Record<string, RomiCore.DoorState>>({});
export const FleetStateContext = React.createContext<Record<string, RomiCore.FleetState>>({});
export const LiftStateContext = React.createContext<Record<string, RomiCore.LiftState>>({});
export const NegotiationStatusContext = React.createContext<Record<number, NegotiationConflict>>(
  {},
);
export const TasksContext = React.createContext<RomiCore.TaskSummary[]>([]);
export const TransportContext = React.createContext<RomiCore.Transport | null>(null);
export const BuildingMapContext = React.createContext<RomiCore.BuildingMap | null>(null);

export interface RmfIngress {
  dispenserStateManager: DispenserStateManager;
  doorStateManager: DoorStateManager;
  fleetManager: FleetManager;
  liftStateManager: LiftStateManager;
  negotiationStatusManager: NegotiationStatusManager;
  taskManager: TaskManager;
  trajectoryManager?: RobotTrajectoryManager;
}

export const RmfIngressContext = React.createContext<RmfIngress>({
  dispenserStateManager: new DispenserStateManager(),
  doorStateManager: new DoorStateManager(),
  fleetManager: new FleetManager(),
  liftStateManager: new LiftStateManager(),
  negotiationStatusManager: new NegotiationStatusManager(appConfig.trajServerUrl),
  taskManager: new TaskManager(),
});
