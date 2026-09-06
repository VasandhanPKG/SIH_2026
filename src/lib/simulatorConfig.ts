/**
 * MINE RESCUE COMMAND — 3D Simulator Configuration & Deterministic State Engine
 * Smart India Hackathon 2026 (Problem Statement ID: 26039)
 * 
 * 5 Core Pillars:
 * 1. EXPLORE: Rover explores underground tunnels & synthesizes 3D LiDAR SLAM map
 * 2. MONITOR: Continuous multi-gas pellistors (O2, CH4, CO, Temp, Humidity, Battery, Signal)
 * 3. DETECT: Identifies trapped workers, structural roof fractures & hazard zones
 * 4. ANALYSE: Fuses sensor, hazard & spatial data to calculate risk & compute Route B
 * 5. CONNECT: Wireless ad-hoc mesh pulse transmission to Subsurface Base Command
 */

export type MissionPhaseKey = 'READY' | 'EXPLORE' | 'MONITOR' | 'DETECT' | 'ANALYSE' | 'CONNECT' | 'COMPLETE';

export interface PillarConfig {
  id: MissionPhaseKey;
  stepNumber: string;
  name: string;
  tagline: string;
  description: string;
  durationSec: number;
  highlightColor: string;
}

export const FIVE_PILLARS: PillarConfig[] = [
  {
    id: 'EXPLORE',
    stepNumber: '01',
    name: 'EXPLORE',
    tagline: 'Maps the unknown.',
    description: 'Rover ingress into uncharted drift. LiDAR sweeps synthesize 3D SLAM tunnel mesh and navigation corridors in real time.',
    durationSec: 10,
    highlightColor: '#3b82f6', // blue-500
  },
  {
    id: 'MONITOR',
    stepNumber: '02',
    name: 'MONITOR',
    tagline: 'Measures the danger.',
    description: 'Continuous atmospheric & environmental surveillance. Multi-gas pellistors detect combustible methane surge up to 2.4% LEL.',
    durationSec: 10,
    highlightColor: '#f59e0b', // amber-500
  },
  {
    id: 'DETECT',
    stepNumber: '03',
    name: 'DETECT',
    tagline: 'Finds the trapped.',
    description: 'Multi-spectral sensor fusion halts rover and executes 360° scan. Flags survivor PRSN-01 inside Refuge Chamber 7B and roof shear crack.',
    durationSec: 10,
    highlightColor: '#ef4444', // red-500
  },
  {
    id: 'ANALYSE',
    stepNumber: '04',
    name: 'ANALYSE',
    tagline: 'Understands the risk.',
    description: 'AI Risk Engine evaluates gas toxicity + strata fracture. Rejects lethal Route A and synthesizes optimal 100% safe Route B bypass.',
    durationSec: 10,
    highlightColor: '#8b5cf6', // purple-500
  },
  {
    id: 'CONNECT',
    stepNumber: '05',
    name: 'CONNECT',
    tagline: 'Guides the rescue.',
    description: 'Transmits live coordinates, atmospheric readings, and waypoint navigation corridors to Subsurface Rescue Command before human entry.',
    durationSec: 10,
    highlightColor: '#10b981', // emerald-500
  },
];

export interface SimulatorWaypoint {
  x: number;
  y: number;
  z: number;
  headingDeg: number;
  speed: number;
  mappedPct: number;
  distanceM: number;
  gasCh4: number;
  gasO2: number;
  tempC: number;
  humidityPct: number;
  batteryPct: number;
  signalPct: number;
  statusText: string;
}

// Deterministic 3D Waypoint Path through Mine Environment (Coordinates in Three.js units)
export const SIMULATION_WAYPOINTS: Record<MissionPhaseKey, SimulatorWaypoint[]> = {
  READY: [
    {
      x: -32,
      y: 0,
      z: 0,
      headingDeg: 90,
      speed: 0.0,
      mappedPct: 8,
      distanceM: 0.0,
      gasCh4: 0.1,
      gasO2: 20.9,
      tempC: 28.5,
      humidityPct: 62,
      batteryPct: 99.4,
      signalPct: 98,
      statusText: 'STANDBY AT BASE STATION',
    },
  ],
  EXPLORE: [
    {
      x: -32,
      y: 0,
      z: 0,
      headingDeg: 90,
      speed: 1.2,
      mappedPct: 15,
      distanceM: 2.0,
      gasCh4: 0.2,
      gasO2: 20.9,
      tempC: 29.0,
      humidityPct: 63,
      batteryPct: 98.2,
      signalPct: 97,
      statusText: 'ENTERING MAIN HAULAGE TUNNEL A',
    },
    {
      x: -18,
      y: 0,
      z: 0,
      headingDeg: 90,
      speed: 1.4,
      mappedPct: 35,
      distanceM: 14.2,
      gasCh4: 0.3,
      gasO2: 20.8,
      tempC: 30.2,
      humidityPct: 64,
      batteryPct: 96.8,
      signalPct: 96,
      statusText: 'LIDAR POINT CLOUD SYNTHESIZING DRIFTS',
    },
    {
      x: -5,
      y: 0,
      z: 0,
      headingDeg: 90,
      speed: 1.2,
      mappedPct: 50,
      distanceM: 27.0,
      gasCh4: 0.4,
      gasO2: 20.8,
      tempC: 31.0,
      humidityPct: 65,
      batteryPct: 95.5,
      signalPct: 95,
      statusText: 'APPROACHING JUNCTION ALPHA',
    },
  ],
  MONITOR: [
    {
      x: 0,
      y: 0,
      z: 0,
      headingDeg: 75,
      speed: 0.9,
      mappedPct: 65,
      distanceM: 32.0,
      gasCh4: 0.8,
      gasO2: 20.6,
      tempC: 33.4,
      humidityPct: 66,
      batteryPct: 94.0,
      signalPct: 94,
      statusText: 'ATMOSPHERIC SENSORS SCANNING JUNCTION',
    },
    {
      x: 8,
      y: 0,
      z: -4,
      headingDeg: 60,
      speed: 0.6,
      mappedPct: 78,
      distanceM: 38.5,
      gasCh4: 1.6,
      gasO2: 20.2,
      tempC: 36.8,
      humidityPct: 68,
      batteryPct: 92.5,
      signalPct: 92,
      statusText: 'WARNING: CH4 GAS POCKET SURGING',
    },
    {
      x: 14,
      y: 0,
      z: -6,
      headingDeg: 45,
      speed: 0.4,
      mappedPct: 85,
      distanceM: 42.0,
      gasCh4: 2.4,
      gasO2: 19.8,
      tempC: 41.2,
      humidityPct: 71,
      batteryPct: 91.0,
      signalPct: 91,
      statusText: 'CRITICAL: CH4 2.4% LEL IN TUNNEL B-04',
    },
  ],
  DETECT: [
    {
      x: 18,
      y: 0,
      z: -7,
      headingDeg: 30,
      speed: 0.0, // Halted for scanning
      mappedPct: 92,
      distanceM: 45.4,
      gasCh4: 2.4,
      gasO2: 19.8,
      tempC: 42.0,
      humidityPct: 72,
      batteryPct: 89.8,
      signalPct: 90,
      statusText: 'SURVIVOR DETECTED: PRSN-01 (37.2°C HEAT SIGNATURE)',
    },
    {
      x: 18,
      y: 0,
      z: -7,
      headingDeg: 30,
      speed: 0.0,
      mappedPct: 95,
      distanceM: 45.4,
      gasCh4: 2.4,
      gasO2: 19.8,
      tempC: 42.0,
      humidityPct: 72,
      batteryPct: 89.0,
      signalPct: 90,
      statusText: 'ROOF DELAMINATION DETECTED: 8.4mm GAP IN TUNNEL B-04',
    },
  ],
  ANALYSE: [
    {
      x: 18,
      y: 0,
      z: -7,
      headingDeg: 120,
      speed: 0.5,
      mappedPct: 98,
      distanceM: 47.0,
      gasCh4: 1.2,
      gasO2: 20.4,
      tempC: 38.0,
      humidityPct: 69,
      batteryPct: 87.5,
      signalPct: 92,
      statusText: 'AI FUSING HAZARDS: ROUTE A REJECTED (LETHAL)',
    },
    {
      x: 14,
      y: 0,
      z: 2,
      headingDeg: 135,
      speed: 0.8,
      mappedPct: 100,
      distanceM: 52.0,
      gasCh4: 0.4,
      gasO2: 20.8,
      tempC: 34.0,
      humidityPct: 65,
      batteryPct: 86.2,
      signalPct: 93,
      statusText: 'SYNTHESIZING OPTIMAL ROUTE B (SOUTH BYPASS — 100% SAFE)',
    },
  ],
  CONNECT: [
    {
      x: 18,
      y: 0,
      z: 8,
      headingDeg: 75,
      speed: 0.0,
      mappedPct: 100,
      distanceM: 58.4,
      gasCh4: 0.3,
      gasO2: 20.9,
      tempC: 31.5,
      humidityPct: 63,
      batteryPct: 85.0,
      signalPct: 95,
      statusText: 'TRANSMITTING INTELLIGENCE DOSSIER TO BASE COMMAND',
    },
  ],
  COMPLETE: [
    {
      x: 18,
      y: 0,
      z: 8,
      headingDeg: 75,
      speed: 0.0,
      mappedPct: 100,
      distanceM: 58.4,
      gasCh4: 0.2,
      gasO2: 20.9,
      tempC: 30.5,
      humidityPct: 62,
      batteryPct: 84.5,
      signalPct: 96,
      statusText: 'MISSION COMPLETE — SAFE RESCUE CORRIDOR LOCKED',
    },
  ],
};

// 3D Objects in Scene
export const MINE_OBJECTS_CONFIG = {
  baseStation: { x: -35, y: 0, z: 0, label: 'Subsurface Base Relay C2' },
  junctionAlpha: { x: 0, y: 0, z: 0, label: 'Junction Alpha' },
  methaneHazard: { x: 12, y: 0, z: -8, radius: 5.5, label: 'CH4 Gas Pocket (2.4% LEL)' },
  strataFracture: { x: 16, y: 2.8, z: -7, label: 'Roof Delamination (8.4mm Gap)' },
  trappedWorker: { x: 28, y: 0, z: -8, label: 'Worker PRSN-01 (Refuge Chamber 7B)' },
  routeBypass: { x: 12, y: 0, z: 8, label: 'South Incline Bypass (Safe Corridor)' },
  repeaterNode: { x: -10, y: 1.5, z: -2, label: 'Mesh Repeater Node 02' },
};

// Safe Route Points in 3D Space (Route B)
export const ROUTE_B_3D_PATH = [
  { x: -32, y: 0.08, z: 0 },
  { x: -18, y: 0.08, z: 0 },
  { x: -5, y: 0.08, z: 0 },
  { x: 2, y: 0.08, z: 4 },
  { x: 14, y: 0.08, z: 8 },
  { x: 24, y: 0.08, z: 4 },
  { x: 28, y: 0.08, z: -6 },
];

// Blocked Lethal Route A Points in 3D Space
export const ROUTE_A_3D_PATH = [
  { x: -32, y: 0.08, z: 0 },
  { x: -5, y: 0.08, z: 0 },
  { x: 8, y: 0.08, z: -4 },
  { x: 16, y: 0.08, z: -7 },
  { x: 28, y: 0.08, z: -7 },
];

/**
 * Clean Simulation Data Provider abstraction.
 * Allows easy plug-and-play replacement with live Raspberry Pi / MQTT / WebSocket data.
 */
export interface ISimulationDataProvider {
  getTelemetry(phase: MissionPhaseKey, progressPct: number): SimulatorWaypoint;
  getDetectionData(phase: MissionPhaseKey): {
    humanDetected: boolean;
    workerLocation: string;
    bodyTempC: number;
    hazardCh4Pct: number;
    strataGapMm: number;
    aiConfidence: number;
  };
  getAnalysisData(phase: MissionPhaseKey): {
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    reasons: string[];
    recommendedRoute: string;
    routeSafetyPct: number;
  };
}

export class DeterministicSimulationDataProvider implements ISimulationDataProvider {
  getTelemetry(phase: MissionPhaseKey, progressPct: number): SimulatorWaypoint {
    const waypoints = SIMULATION_WAYPOINTS[phase] || SIMULATION_WAYPOINTS.READY;
    if (waypoints.length === 1) return waypoints[0];

    const idxFloat = (waypoints.length - 1) * Math.min(1, Math.max(0, progressPct));
    const idxA = Math.floor(idxFloat);
    const idxB = Math.min(waypoints.length - 1, idxA + 1);
    const t = idxFloat - idxA;

    const a = waypoints[idxA];
    const b = waypoints[idxB];

    // Smooth linear interpolation between waypoints
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t,
      headingDeg: a.headingDeg + (b.headingDeg - a.headingDeg) * t,
      speed: a.speed + (b.speed - a.speed) * t,
      mappedPct: Math.round(a.mappedPct + (b.mappedPct - a.mappedPct) * t),
      distanceM: +(a.distanceM + (b.distanceM - a.distanceM) * t).toFixed(1),
      gasCh4: +(a.gasCh4 + (b.gasCh4 - a.gasCh4) * t).toFixed(2),
      gasO2: +(a.gasO2 + (b.gasO2 - a.gasO2) * t).toFixed(1),
      tempC: +(a.tempC + (b.tempC - a.tempC) * t).toFixed(1),
      humidityPct: Math.round(a.humidityPct + (b.humidityPct - a.humidityPct) * t),
      batteryPct: +(a.batteryPct + (b.batteryPct - a.batteryPct) * t).toFixed(1),
      signalPct: Math.round(a.signalPct + (b.signalPct - a.signalPct) * t),
      statusText: t > 0.5 ? b.statusText : a.statusText,
    };
  }

  getDetectionData(phase: MissionPhaseKey) {
    const isDetected = phase === 'DETECT' || phase === 'ANALYSE' || phase === 'CONNECT' || phase === 'COMPLETE';
    return {
      humanDetected: isDetected,
      workerLocation: 'Tunnel B-03 / Refuge Chamber 7B',
      bodyTempC: 37.2,
      hazardCh4Pct: phase === 'READY' || phase === 'EXPLORE' ? 0.2 : 2.4,
      strataGapMm: phase === 'READY' || phase === 'EXPLORE' ? 0.4 : 8.4,
      aiConfidence: isDetected ? 95 : 0,
    };
  }

  getAnalysisData(phase: MissionPhaseKey) {
    const hasRisk = phase === 'MONITOR' || phase === 'DETECT' || phase === 'ANALYSE' || phase === 'CONNECT' || phase === 'COMPLETE';
    const isSafeRouteReady = phase === 'ANALYSE' || phase === 'CONNECT' || phase === 'COMPLETE';

    return {
      riskLevel: hasRisk ? ('HIGH' as const) : ('LOW' as const),
      reasons: hasRisk
        ? [
            'Combustible Methane (CH4) 2.4% LEL in Tunnel B-04',
            'Roof strata delamination (8.4mm shear gap)',
            'Trapped miner detected in Refuge Chamber 7B',
            'Direct Route A impassable due to toxicity',
          ]
        : ['Subsurface corridor atmospheric air nominal'],
      recommendedRoute: isSafeRouteReady ? 'Route B (South Incline Bypass)' : 'Calculating...',
      routeSafetyPct: isSafeRouteReady ? 100 : 45,
    };
  }
}

export const simulationDataProvider = new DeterministicSimulationDataProvider();
