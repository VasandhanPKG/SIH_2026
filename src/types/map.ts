export interface TunnelSegment {
  id: string;
  name: string;
  fromJunction: string;
  toJunction: string;
  points: Array<{ x: number; y: number }>;
  lengthMeters: number;
  widthMeters: number;
  sector: string;
  status: 'SAFE' | 'HAZARDOUS' | 'EXPLORING' | 'UNEXPLORED';
  stabilityPct: number;
}

export interface MineJunction {
  id: string;
  name: string;
  x: number;
  y: number;
  depthMeters: number;
  type: 'SHAFT_ENTRY' | 'JUNCTION' | 'CHAMBER' | 'REFUGE_STATION' | 'COLLAPSE_ZONE';
  label: string;
}

export interface MapLayerState {
  tunnels: boolean;
  sensors: boolean;
  hazards: boolean;
  personnel: boolean;
  infrastructure: boolean;
  communicationNodes: boolean;
  grid: boolean;
  slamCloud: boolean;
  safeRoute: boolean;
}
