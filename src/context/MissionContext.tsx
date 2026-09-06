"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { RoverTelemetry } from "@/types/telemetry";
import { Alert, Hazard, PersonDetection, SafePathRoute, StructuralAnalysis, CommunicationNode } from "@/types/mission";
import { MapLayerState } from "@/types/map";
import { DEMO_STAGES } from "@/lib/demoScript";
import { DemoStageConfig } from "@/types/demo";
import { INITIAL_MESH_NODES } from "@/lib/mineMapData";
import { IDataProvider } from "@/services/DataProvider";
import { mockDataProvider } from "@/services/MockDataProvider";
import { liveDataProvider } from "@/services/LiveDataProvider";

interface MissionContextType {
  // Mode
  mode: 'DEMO' | 'LIVE';
  setMode: (mode: 'DEMO' | 'LIVE') => void;
  
  // Connection
  isConnected: boolean;
  
  // Telemetry & State
  telemetry: RoverTelemetry;
  hazards: Hazard[];
  persons: PersonDetection[];
  structuralAnalysis: StructuralAnalysis;
  routes: SafePathRoute[];
  alerts: Alert[];
  meshNodes: CommunicationNode[];
  
  // Camera & Controls
  cameraMode: 'RGB' | 'THERMAL';
  setCameraMode: (mode: 'RGB' | 'THERMAL') => void;
  driveRover: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP') => void;
  setNavMode: (navMode: 'MANUAL' | 'AUTO_NAV') => void;
  isEmergencyStopped: boolean;
  triggerEmergencyStop: () => void;
  resumeFromEmergencyStop: () => void;
  
  // Map Interactions
  layers: MapLayerState;
  toggleLayer: (layerKey: keyof MapLayerState) => void;
  selectedEntity: { type: 'ROVER' | 'HAZARD' | 'PERSON' | 'NODE' | null; id: string | null };
  selectEntity: (type: 'ROVER' | 'HAZARD' | 'PERSON' | 'NODE' | null, id: string | null) => void;
  
  // Demo Engine
  currentStageIndex: number;
  currentStage: DemoStageConfig;
  isDemoPlaying: boolean;
  demoProgressSec: number;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  startMission: () => void;
  playDemo: () => void;
  pauseDemo: () => void;
  nextStage: () => void;
  prevStage: () => void;
  skipStage: (stageIndex: number) => void;
  restartDemo: () => void;
  
  // Action Handlers
  dispatchRescueTeam: () => void;
  isRescueDispatched: boolean;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
}

const defaultTelemetry: RoverTelemetry = {
  roverId: "ROVER-01",
  name: "ARES-V MINE SCOUT",
  status: "STANDBY",
  battery: 100,
  powerDrawKw: 1.8,
  estimatedRuntimeMin: 320,
  speed: 0.0,
  headingDeg: 90,
  temperature: 36.2,
  signalStrength: 100,
  latency: 12,
  packetLoss: 0.0,
  motorCurrent: 1.4,
  lidarRateHz: 120,
  lidarPointCount: 142000,
  depthMeters: -680,
  exploredAreaPct: 10,
  position: { x: 100, y: 350, z: -680, sector: "Sector 7A", tunnelId: "TUNNEL_MAIN_A" },
  imu: { accelX: 0.02, accelY: -0.01, accelZ: 9.81, pitch: -1.2, roll: 0.4, yaw: 89.6 },
  gas: { ch4: 0.1, co: 4, o2: 20.9 },
  timestamp: new Date().toISOString(),
};

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  // Demo State Machine
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [demoProgressSec, setDemoProgressSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRescueDispatched, setIsRescueDispatched] = useState<boolean>(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  
  // Telemetry & Dynamic State
  const [telemetry, setTelemetry] = useState<RoverTelemetry>(defaultTelemetry);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [persons, setPersons] = useState<PersonDetection[]>([]);
  const [structuralAnalysis, setStructuralAnalysis] = useState<StructuralAnalysis>(DEMO_STAGES[0].structuralAnalysis);
  const [routes, setRoutes] = useState<SafePathRoute[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_STAGES[0].alerts);
  const [meshNodes, setMeshNodes] = useState<CommunicationNode[]>(INITIAL_MESH_NODES);
  
  // Camera & Map
  const [cameraMode, setCameraMode] = useState<'RGB' | 'THERMAL'>('RGB');
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'ROVER' | 'HAZARD' | 'PERSON' | 'NODE' | null; id: string | null }>({
    type: 'ROVER',
    id: 'ROVER-01',
  });
  
  const [layers, setLayers] = useState<MapLayerState>({
    tunnels: true,
    sensors: true,
    hazards: true,
    personnel: true,
    infrastructure: true,
    communicationNodes: true,
    grid: true,
    slamCloud: true,
    safeRoute: true,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dataProviderRef = useRef<IDataProvider>(mockDataProvider);

  // Active Stage
  const currentStage = DEMO_STAGES[currentStageIndex] || DEMO_STAGES[0];

  // Set active mode
  const setMode = useCallback((newMode: 'DEMO' | 'LIVE') => {
    setModeState(newMode);
    if (newMode === 'LIVE') {
      dataProviderRef.current = liveDataProvider;
      liveDataProvider.connect();
      setIsDemoPlaying(false);
    } else {
      dataProviderRef.current = mockDataProvider;
      liveDataProvider.disconnect();
    }
  }, []);

  // Sync state to current stage
  const applyStageState = useCallback((stageIdx: number) => {
    const stage = DEMO_STAGES[stageIdx];
    if (!stage) return;
    
    setTelemetry((prev) => ({
      ...prev,
      ...stage.telemetry,
      status: isEmergencyStopped ? 'EMERGENCY_STOP' : (stage.telemetry.status || prev.status),
      imu: {
        accelX: +(Math.sin(Date.now() / 800) * 0.4 + 0.1).toFixed(2),
        accelY: +(Math.cos(Date.now() / 900) * 0.3 - 0.2).toFixed(2),
        accelZ: 9.81,
        pitch: +(-2.4 + Math.sin(Date.now() / 1200) * 1.5).toFixed(1),
        roll: +(0.8 + Math.cos(Date.now() / 1400) * 1.2).toFixed(1),
        yaw: stage.telemetry.headingDeg ?? prev.headingDeg,
      },
      gas: stage.telemetry.gas || prev.gas,
      position: stage.telemetry.position || prev.position,
      timestamp: new Date().toISOString(),
    }));
    
    setHazards(stage.hazards);
    setPersons(stage.persons);
    setStructuralAnalysis(stage.structuralAnalysis);
    setRoutes(stage.routes);
    setAlerts((prev) => {
      // Merge unique alerts
      const existingIds = new Set(prev.map(a => a.id));
      const newAlerts = stage.alerts.filter(a => !existingIds.has(a.id));
      return [...newAlerts, ...prev];
    });
    
    if (stage.cameraMode) {
      setCameraMode(stage.cameraMode);
    }
    
    setDemoProgressSec(0);
  }, [isEmergencyStopped]);

  // Stage change trigger
  const goToStage = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= DEMO_STAGES.length) return;
    setCurrentStageIndex(newIndex);
    applyStageState(newIndex);
  }, [applyStageState]);

  const startMission = useCallback(() => {
    setCurrentStageIndex(0);
    applyStageState(0);
    setIsDemoPlaying(true);
    setIsRescueDispatched(false);
    setIsEmergencyStopped(false);
  }, [applyStageState]);

  const playDemo = useCallback(() => setIsDemoPlaying(true), []);
  const pauseDemo = useCallback(() => setIsDemoPlaying(false), []);
  const nextStage = useCallback(() => {
    if (currentStageIndex < DEMO_STAGES.length - 1) {
      goToStage(currentStageIndex + 1);
    } else {
      setIsDemoPlaying(false);
    }
  }, [currentStageIndex, goToStage]);

  const prevStage = useCallback(() => {
    if (currentStageIndex > 0) {
      goToStage(currentStageIndex - 1);
    }
  }, [currentStageIndex, goToStage]);

  const skipStage = useCallback((index: number) => {
    goToStage(index);
  }, [goToStage]);

  const restartDemo = useCallback(() => {
    goToStage(0);
    setIsDemoPlaying(true);
    setIsRescueDispatched(false);
    setIsEmergencyStopped(false);
  }, [goToStage]);

  // Live Timer Simulation loop
  useEffect(() => {
    if (!isDemoPlaying || isEmergencyStopped) return;

    const intervalMs = 250;
    const progressStep = (intervalMs / 1000) * playbackSpeed;

    timerRef.current = setInterval(() => {
      setDemoProgressSec((prev) => {
        const nextVal = prev + progressStep;
        const currentStageDuration = DEMO_STAGES[currentStageIndex]?.durationSec || 10;
        
        // Micro-fluctuate telemetry numbers for hyper-realistic HUD feel
        setTelemetry((curr) => {
          const jitterSpeed = curr.status === 'DEPLOYING' || curr.status === 'MAPPING' || curr.status === 'AUTO_NAV'
            ? +(curr.speed + (Math.random() * 0.08 - 0.04)).toFixed(2)
            : 0;
          const jitterBattery = Math.max(10, +(curr.battery - 0.005 * playbackSpeed).toFixed(2));
          const jitterTemp = +(curr.temperature + (Math.random() * 0.1 - 0.05)).toFixed(1);
          const jitterSignal = Math.min(100, Math.max(75, Math.round(curr.signalStrength + (Math.random() * 2 - 1))));
          
          return {
            ...curr,
            battery: jitterBattery,
            speed: Math.max(0, jitterSpeed),
            temperature: jitterTemp,
            signalStrength: jitterSignal,
            latency: Math.max(8, Math.round(curr.latency + (Math.random() * 4 - 2))),
            imu: {
              ...curr.imu,
              pitch: +(curr.imu.pitch + (Math.random() * 0.2 - 0.1)).toFixed(1),
              roll: +(curr.imu.roll + (Math.random() * 0.2 - 0.1)).toFixed(1),
            },
            timestamp: new Date().toISOString(),
          };
        });

        // Stage progress completion check
        if (nextVal >= currentStageDuration) {
          if (currentStageIndex < DEMO_STAGES.length - 1) {
            goToStage(currentStageIndex + 1);
          } else {
            setIsDemoPlaying(false);
          }
          return 0;
        }
        return nextVal;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDemoPlaying, currentStageIndex, playbackSpeed, isEmergencyStopped, goToStage]);

  // Actions
  const dispatchRescueTeam = useCallback(() => {
    setIsRescueDispatched(true);
    // Add success alert
    const newAlert: Alert = {
      id: `ALT-DISPATCH-CONF-${Date.now()}`,
      title: "RESCUE TEAM DELTA DISPATCHED",
      message: "Rapid Response Brigade entering Sector 7B via Route B safe corridor.",
      category: "INFO",
      roverId: "ROVER 01",
      sector: "Sector 7B",
      location: "Route B South Drift",
      timestamp: new Date().toLocaleTimeString(),
      acknowledged: true,
      resolved: false,
      recommendedAction: "Maintain live thermal uplink and gas telemetry guard.",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    // Auto advance to completed after 3 seconds if playing
    setTimeout(() => {
      goToStage(7); // STAGE 8 MISSION COMPLETE
    }, 2500);
  }, [goToStage]);

  const triggerEmergencyStop = useCallback(() => {
    setIsEmergencyStopped(true);
    setIsDemoPlaying(false);
    setTelemetry((prev) => ({
      ...prev,
      status: "EMERGENCY_STOP",
      speed: 0.0,
      motorCurrent: 0.0,
    }));
    const alert: Alert = {
      id: `ALT-ESTOP-${Date.now()}`,
      title: "EMERGENCY STOP ENGAGED",
      message: "Operator initiated emergency actuator lockdown. Rover 01 stationary.",
      category: "CRITICAL",
      roverId: "ROVER 01",
      sector: telemetry.position.sector,
      location: telemetry.position.tunnelId,
      timestamp: new Date().toLocaleTimeString(),
      acknowledged: false,
      resolved: false,
      recommendedAction: "Inspect hazards or manually reset emergency lock.",
    };
    setAlerts((prev) => [alert, ...prev]);
  }, [telemetry.position]);

  const resumeFromEmergencyStop = useCallback(() => {
    setIsEmergencyStopped(false);
    setTelemetry((prev) => ({
      ...prev,
      status: "ACTIVE",
    }));
  }, []);

  const driveRover = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP') => {
    if (isEmergencyStopped) return;
    setTelemetry((prev) => {
      let newX = prev.position.x;
      let newY = prev.position.y;
      let heading = prev.headingDeg;
      let speed = prev.speed;

      if (direction === 'UP') {
        newY -= 15;
        heading = 0;
        speed = 1.4;
      } else if (direction === 'DOWN') {
        newY += 15;
        heading = 180;
        speed = 1.4;
      } else if (direction === 'LEFT') {
        newX -= 15;
        heading = 270;
        speed = 1.1;
      } else if (direction === 'RIGHT') {
        newX += 15;
        heading = 90;
        speed = 1.1;
      } else {
        speed = 0.0;
      }

      return {
        ...prev,
        speed,
        headingDeg: heading,
        position: {
          ...prev.position,
          x: Math.max(50, Math.min(950, newX)),
          y: Math.max(50, Math.min(650, newY)),
        },
      };
    });
  }, [isEmergencyStopped]);

  const setNavMode = useCallback((navMode: 'MANUAL' | 'AUTO_NAV') => {
    setTelemetry((prev) => ({
      ...prev,
      status: navMode,
    }));
  }, []);

  const toggleLayer = useCallback((layerKey: keyof MapLayerState) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const selectEntity = useCallback((type: 'ROVER' | 'HAZARD' | 'PERSON' | 'NODE' | null, id: string | null) => {
    setSelectedEntity({ type, id });
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, acknowledged: true } : a))
    );
  }, []);

  return (
    <MissionContext.Provider
      value={{
        mode,
        setMode,
        isConnected,
        telemetry,
        hazards,
        persons,
        structuralAnalysis,
        routes,
        alerts,
        meshNodes,
        cameraMode,
        setCameraMode,
        driveRover,
        setNavMode,
        isEmergencyStopped,
        triggerEmergencyStop,
        resumeFromEmergencyStop,
        layers,
        toggleLayer,
        selectedEntity,
        selectEntity,
        currentStageIndex,
        currentStage,
        isDemoPlaying,
        demoProgressSec,
        playbackSpeed,
        setPlaybackSpeed,
        startMission,
        playDemo,
        pauseDemo,
        nextStage,
        prevStage,
        skipStage,
        restartDemo,
        dispatchRescueTeam,
        isRescueDispatched,
        acknowledgeAlert,
        resolveAlert,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
};
