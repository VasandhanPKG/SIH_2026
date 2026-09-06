import { IDataProvider, TelemetryCallback, HazardCallback, PersonCallback, AlertCallback } from "./DataProvider";
import { RoverTelemetry } from "@/types/telemetry";
import { Alert, Hazard, PersonDetection } from "@/types/mission";
import { DEMO_STAGES } from "@/lib/demoScript";

export class MockDataProvider implements IDataProvider {
  private connected: boolean = true;
  private telemetrySubscribers: Set<TelemetryCallback> = new Set();
  private hazardSubscribers: Set<HazardCallback> = new Set();
  private personSubscribers: Set<PersonCallback> = new Set();
  private alertSubscribers: Set<AlertCallback> = new Set();

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getMode(): 'DEMO' | 'LIVE' {
    return 'DEMO';
  }

  subscribeTelemetry(cb: TelemetryCallback): () => void {
    this.telemetrySubscribers.add(cb);
    return () => this.telemetrySubscribers.delete(cb);
  }

  subscribeHazards(cb: HazardCallback): () => void {
    this.hazardSubscribers.add(cb);
    return () => this.hazardSubscribers.delete(cb);
  }

  subscribePersons(cb: PersonCallback): () => void {
    this.personSubscribers.add(cb);
    return () => this.personSubscribers.delete(cb);
  }

  subscribeAlerts(cb: AlertCallback): () => void {
    this.alertSubscribers.add(cb);
    return () => this.alertSubscribers.delete(cb);
  }

  async sendEmergencyStop(roverId: string): Promise<boolean> {
    console.log(`[MockDataProvider] Emergency stop sent for ${roverId}`);
    return true;
  }

  async sendDriveCommand(roverId: string, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP'): Promise<boolean> {
    console.log(`[MockDataProvider] Drive command [${direction}] sent for ${roverId}`);
    return true;
  }

  async setNavMode(roverId: string, mode: 'MANUAL' | 'AUTO_NAV'): Promise<boolean> {
    console.log(`[MockDataProvider] Nav mode [${mode}] set for ${roverId}`);
    return true;
  }

  async dispatchRescueTeam(routeId: string, targetPersonId: string): Promise<boolean> {
    console.log(`[MockDataProvider] Rescue team dispatched along ${routeId} for ${targetPersonId}`);
    return true;
  }

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    console.log(`[MockDataProvider] Alert ${alertId} acknowledged`);
    return true;
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    console.log(`[MockDataProvider] Alert ${alertId} resolved`);
    return true;
  }
}

export const mockDataProvider = new MockDataProvider();
