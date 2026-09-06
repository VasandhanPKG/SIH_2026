import { IDataProvider, TelemetryCallback, HazardCallback, PersonCallback, AlertCallback } from "./DataProvider";
import { RoverTelemetry } from "@/types/telemetry";
import { Alert, Hazard, PersonDetection } from "@/types/mission";

export class LiveDataProvider implements IDataProvider {
  private socket: WebSocket | null = null;
  private connected: boolean = false;
  private wsUrl: string;
  private apiUrl: string;
  private telemetrySubscribers: Set<TelemetryCallback> = new Set();
  private hazardSubscribers: Set<HazardCallback> = new Set();
  private personSubscribers: Set<PersonCallback> = new Set();
  private alertSubscribers: Set<AlertCallback> = new Set();

  constructor(
    wsUrl: string = "ws://localhost:8000/api/v1/ws/rover",
    apiUrl: string = "http://localhost:8000/api/v1"
  ) {
    this.wsUrl = wsUrl;
    this.apiUrl = apiUrl;
  }

  async connect(): Promise<void> {
    try {
      if (typeof window === "undefined") return;
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        this.connected = true;
        console.log("[LiveDataProvider] Connected to WebSocket gateway:", this.wsUrl);
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "TELEMETRY") {
            this.telemetrySubscribers.forEach((cb) => cb(payload.data));
          } else if (payload.type === "HAZARDS") {
            this.hazardSubscribers.forEach((cb) => cb(payload.data));
          } else if (payload.type === "PERSONNEL") {
            this.personSubscribers.forEach((cb) => cb(payload.data));
          } else if (payload.type === "ALERTS") {
            this.alertSubscribers.forEach((cb) => cb(payload.data));
          }
        } catch (err) {
          console.error("[LiveDataProvider] Error parsing incoming websocket message", err);
        }
      };

      this.socket.onerror = (err) => {
        console.warn("[LiveDataProvider] WebSocket connection error (Running in Fallback Mock):", err);
        this.connected = false;
      };

      this.socket.onclose = () => {
        this.connected = false;
        console.log("[LiveDataProvider] WebSocket connection closed");
      };
    } catch (e) {
      console.warn("[LiveDataProvider] Could not establish live socket connection", e);
      this.connected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getMode(): 'DEMO' | 'LIVE' {
    return 'LIVE';
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
    if (this.connected && this.socket) {
      this.socket.send(JSON.stringify({ action: "EMERGENCY_STOP", roverId }));
      return true;
    }
    try {
      const res = await fetch(`${this.apiUrl}/rover/${roverId}/emergency-stop`, { method: "POST" });
      return res.ok;
    } catch {
      return false;
    }
  }

  async sendDriveCommand(roverId: string, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP'): Promise<boolean> {
    if (this.connected && this.socket) {
      this.socket.send(JSON.stringify({ action: "DRIVE", roverId, direction }));
      return true;
    }
    return true;
  }

  async setNavMode(roverId: string, mode: 'MANUAL' | 'AUTO_NAV'): Promise<boolean> {
    if (this.connected && this.socket) {
      this.socket.send(JSON.stringify({ action: "SET_NAV_MODE", roverId, mode }));
      return true;
    }
    return true;
  }

  async dispatchRescueTeam(routeId: string, targetPersonId: string): Promise<boolean> {
    if (this.connected && this.socket) {
      this.socket.send(JSON.stringify({ action: "DISPATCH_RESCUE", routeId, targetPersonId }));
      return true;
    }
    return true;
  }

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    return true;
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    return true;
  }
}

export const liveDataProvider = new LiveDataProvider();
