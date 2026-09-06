import { Alert, Hazard, PersonDetection, SafePathRoute, StructuralAnalysis } from './mission';
import { RoverTelemetry } from './telemetry';

export type DemoStageKey =
  | 'INITIALIZATION'
  | 'DEPLOYMENT'
  | 'MAPPING'
  | 'HAZARD_DETECTION'
  | 'SURVIVOR_DETECTION'
  | 'AI_ANALYSIS'
  | 'RESCUE_ALERT'
  | 'MISSION_COMPLETE';

export interface DemoStageConfig {
  key: DemoStageKey;
  stageNumber: number;
  totalStages: number;
  durationSec: number;
  title: string;
  subtitle: string;
  description: string;
  bannerTone: 'info' | 'cyan' | 'warning' | 'critical' | 'success';
  cameraMode: 'RGB' | 'THERMAL';
  
  // State overrides & targets
  telemetry: Partial<RoverTelemetry>;
  revealedTunnelCoveragePct: number;
  activeTunnels: string[];
  hazards: Hazard[];
  persons: PersonDetection[];
  structuralAnalysis: StructuralAnalysis;
  routes: SafePathRoute[];
  alerts: Alert[];
  
  // Audio/Visual trigger cues
  pulseAlert?: boolean;
  highlightedElementId?: string;
}

export interface MissionSummaryData {
  missionDuration: string;
  distanceTraveledMeters: number;
  tunnelsExplored: number;
  hazardsDetected: number;
  survivorsLocated: number;
  maxRiskLevel: 'HIGH' | 'CRITICAL';
  batteryConsumedPct: number;
  safeRoutePlanned: string;
  rescueStatus: 'DISPATCHED' | 'STANDBY' | 'SUCCESS';
}
