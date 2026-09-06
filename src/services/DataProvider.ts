import { RoverTelemetry } from "@/types/telemetry";
import { Alert, Hazard, PersonDetection, SafePathRoute, StructuralAnalysis, SystemHealth } from "@/types/mission";

export type TelemetryCallback = (telemetry: RoverTelemetry) => void;
export type HazardCallback = (hazards: Hazard[]) => void;
export type PersonCallback = (persons: PersonDetection[]) => void;
export type AlertCallback = (alerts: Alert[]) => void;

export interface IDataProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getMode(): 'DEMO' | 'LIVE';
  
  // Subscribers
  subscribeTelemetry(cb: TelemetryCallback): () => void;
  subscribeHazards(cb: HazardCallback): () => void;
  subscribePersons(cb: PersonCallback): () => void;
  subscribeAlerts(cb: AlertCallback): () => void;
  
  // Commands
  sendEmergencyStop(roverId: string): Promise<boolean>;
  sendDriveCommand(roverId: string, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP'): Promise<boolean>;
  setNavMode(roverId: string, mode: 'MANUAL' | 'AUTO_NAV'): Promise<boolean>;
  dispatchRescueTeam(routeId: string, targetPersonId: string): Promise<boolean>;
  acknowledgeAlert(alertId: string): Promise<boolean>;
  resolveAlert(alertId: string): Promise<boolean>;
}
