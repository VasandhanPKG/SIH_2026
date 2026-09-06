export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export type HazardType =
  | 'METHANE'
  | 'CARBON_MONOXIDE'
  | 'STRUCTURAL_FRACTURE'
  | 'WATER_INGRESS'
  | 'ROOF_COLLAPSE_RISK'
  | 'HIGH_TEMPERATURE';

export interface Hazard {
  id: string;
  type: HazardType;
  title: string;
  severity: SeverityLevel;
  confidence: number;       // 0 - 100%
  valueDisplay: string;     // e.g. "2.4% LEL" or "8mm Crack"
  location: {
    x: number;
    y: number;
    label: string;
    sector: string;
  };
  timestamp: string;
  status: 'ACTIVE' | 'ISOLATED' | 'RESOLVED';
  recommendedAction: string;
}

export type PersonStatus = 'TRACKED' | 'STABLE' | 'LOST_SIGNAL' | 'RESCUED';
export type PersonVital = 'NORMAL' | 'ELEVATED' | 'CRITICAL' | 'UNKNOWN';

export interface PersonDetection {
  id: string;
  callsign: string;
  confidence: number;       // 0 - 100%
  status: PersonStatus;
  vitalStatus: PersonVital;
  location: {
    x: number;
    y: number;
    label: string;
    sector: string;
  };
  distanceMeters: number;
  detectionSource: 'THERMAL + RGB' | 'THERMAL' | 'RGB' | 'ACOUSTIC';
  thermalTempC?: number;
  timestamp: string;
}

export interface StructuralAnalysis {
  assessment: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  fractureZone: string;
  currentDisplacementMm: number;
  displacementTrend: Array<{
    time: string;
    displacementMm: number;
    thresholdMm: number;
  }>;
  displacementRateMmHr: number;
  rockBoltStrainPct: number;
  aiConfidence: number;
  safetyMarginPct: number;
}

export interface SafePathRoute {
  id: string;
  name: string;
  riskLevel: 'SAFE' | 'MEDIUM_RISK' | 'HIGH_RISK';
  pathNodes: Array<{ x: number; y: number; label?: string }>;
  lengthMeters: number;
  estimatedTransitTimeMin: number;
  hazardsAvoided: string[];
  recommended: boolean;
  notes: string;
}

export interface MissionEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  sector: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  category: SeverityLevel;
  roverId: string;
  sector: string;
  location: string;
  confidence?: number;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  recommendedAction: string;
}

export interface CommunicationNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  signalPct: number;
  latencyMs: number;
  packetLossPct: number;
  batteryPct: number;
  location: {
    x: number;
    y: number;
    label: string;
  };
}

export interface SystemHealth {
  meshNetworkStatus: 'CONNECTED' | 'DEGRADED' | 'OFFLINE';
  nodes: CommunicationNode[];
  sensors: {
    rgbCamera: boolean;
    thermalCamera: boolean;
    lidar3d: boolean;
    imu: boolean;
    gasCh4: boolean;
    gasCo: boolean;
    gasO2: boolean;
  };
  aiEngine: {
    status: 'RUNNING' | 'DEGRADED' | 'OFFLINE';
    fps: number;
    confidenceAverage: number;
    activeModel: string;
  };
  power: {
    batteryHealthPct: number;
    cycles: number;
    motorStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
    temperatureC: number;
  };
}
