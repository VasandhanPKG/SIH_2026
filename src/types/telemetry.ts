export interface IMUData {
  accelX: number;
  accelY: number;
  accelZ: number;
  pitch: number;
  roll: number;
  yaw: number;
}

export interface GasReading {
  ch4: number; // Methane % LEL (Lower Explosive Limit)
  co: number;  // Carbon Monoxide ppm
  o2: number;  // Oxygen %
  co2?: number; // CO2 %
}

export interface RoverPosition {
  x: number;
  y: number;
  z: number;
  sector: string;
  tunnelId: string;
}

export type RoverOperationalState =
  | 'STANDBY'
  | 'DEPLOYING'
  | 'ACTIVE'
  | 'MAPPING'
  | 'MANUAL'
  | 'AUTO_NAV'
  | 'EMERGENCY_STOP'
  | 'RETURNING'
  | 'COMPLETED';

export interface RoverTelemetry {
  roverId: string;
  name: string;
  status: RoverOperationalState;
  battery: number;           // percentage 0 - 100
  powerDrawKw: number;       // kW/h
  estimatedRuntimeMin: number;
  speed: number;             // m/s
  headingDeg: number;        // 0 - 360
  temperature: number;       // Celsius
  signalStrength: number;    // percentage 0 - 100
  latency: number;           // ms
  packetLoss: number;        // percentage
  motorCurrent: number;      // Amperes
  lidarRateHz: number;       // Hz (e.g. 120)
  lidarPointCount: number;
  depthMeters: number;       // e.g. -740m
  exploredAreaPct: number;   // 0 - 100%
  position: RoverPosition;
  imu: IMUData;
  gas: GasReading;
  timestamp: string;
}
