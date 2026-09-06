"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MissionPhaseKey,
  FIVE_PILLARS,
  simulationDataProvider,
  SimulatorWaypoint,
} from "@/lib/simulatorConfig";
import { MineScene3D, CameraViewMode } from "./MineScene3D";
import { FivePillarsTimeline } from "./FivePillarsTimeline";
import { LiveTelemetryPanel } from "./LiveTelemetryPanel";
import { ControlStationPanel } from "./ControlStationPanel";
import { SimulatorMinimap } from "./SimulatorMinimap";
import { SimulationControls } from "./SimulationControls";
import { MissionDebriefModal } from "./MissionDebriefModal";
import { Sparkles, Layers, Shield } from "lucide-react";

export const MineRescueSimulator: React.FC = () => {
  // State Machine
  const [phase, setPhase] = useState<MissionPhaseKey>("READY");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>("CHASE_CAM");
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);

  // Compute interpolated waypoint
  const currentWaypoint: SimulatorWaypoint = simulationDataProvider.getTelemetry(phase, progressPct);

  // Timer loop for automated mission progression
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startMission = useCallback(() => {
    setPhase("EXPLORE");
    setProgressPct(0);
    setIsPlaying(true);
    setShowDebriefModal(false);
  }, []);

  const pauseMission = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeMission = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const replayMission = useCallback(() => {
    setPhase("READY");
    setProgressPct(0);
    setIsPlaying(false);
    setShowDebriefModal(false);
  }, []);

  const selectPhase = useCallback((newPhase: MissionPhaseKey) => {
    setPhase(newPhase);
    setProgressPct(0);
    setIsPlaying(true);
  }, []);

  const nextPhase = useCallback(() => {
    const idx = FIVE_PILLARS.findIndex((p) => p.id === phase);
    if (idx >= 0 && idx < FIVE_PILLARS.length - 1) {
      setPhase(FIVE_PILLARS[idx + 1].id);
      setProgressPct(0);
      setIsPlaying(true);
    } else if (idx === FIVE_PILLARS.length - 1) {
      setPhase("COMPLETE");
      setIsPlaying(false);
      setShowDebriefModal(true);
    }
  }, [phase]);

  const prevPhase = useCallback(() => {
    const idx = FIVE_PILLARS.findIndex((p) => p.id === phase);
    if (idx > 0) {
      setPhase(FIVE_PILLARS[idx - 1].id);
      setProgressPct(0);
      setIsPlaying(true);
    } else if (phase === "COMPLETE") {
      setPhase("CONNECT");
      setProgressPct(0);
      setIsPlaying(true);
    }
  }, [phase]);

  // Main automated simulation timer loop
  useEffect(() => {
    if (!isPlaying || phase === "READY" || phase === "COMPLETE") return;

    const intervalMs = 50;
    const currentPillar = FIVE_PILLARS.find((p) => p.id === phase);
    const durationSec = currentPillar?.durationSec || 10;
    const stepIncrement = (intervalMs / 1000 / durationSec) * speed;

    timerRef.current = setInterval(() => {
      setProgressPct((prev) => {
        const nextVal = prev + stepIncrement;
        if (nextVal >= 1.0) {
          // Advance to next pillar
          const idx = FIVE_PILLARS.findIndex((p) => p.id === phase);
          if (idx >= 0 && idx < FIVE_PILLARS.length - 1) {
            setPhase(FIVE_PILLARS[idx + 1].id);
            return 0;
          } else {
            // Mission complete
            setPhase("COMPLETE");
            setIsPlaying(false);
            setShowDebriefModal(true);
            return 1.0;
          }
        }
        return nextVal;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, phase, speed]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner / Mission Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200/80">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Live 3D Mine Rescue Simulation
                </h1>
                <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full font-mono">
                  SIH 2026 Problem ID: 26039
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive subsurface demonstration • Autonomous ingress, multi-gas pellistors, survivor detection & safe route planning
              </p>
            </div>
          </div>
        </div>

        {/* Start / Replay Quick CTA */}
        <div className="flex items-center gap-3">
          {phase === "READY" ? (
            <button
              onClick={startMission}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Layers className="h-4 w-4" />
              <span>Start Mission Demo</span>
            </button>
          ) : (
            <button
              onClick={replayMission}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Mission
            </button>
          )}
        </div>
      </div>

      {/* 5 Core Pillars Step Timeline */}
      <FivePillarsTimeline
        currentPhase={phase}
        progressPct={progressPct}
        onSelectPhase={selectPhase}
      />

      {/* Main 3D Simulation & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive 3D Mine Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          <div className="h-[520px] w-full rounded-2xl overflow-hidden shadow-subtle border border-slate-200/80">
            <MineScene3D
              phase={phase}
              progressPct={progressPct}
              currentWaypoint={currentWaypoint}
              cameraMode={cameraMode}
              onCameraModeChange={setCameraMode}
            />
          </div>

          {/* Simulation Controls Bar */}
          <SimulationControls
            phase={phase}
            isPlaying={isPlaying}
            speed={speed}
            onStart={startMission}
            onPause={pauseMission}
            onResume={resumeMission}
            onReplay={replayMission}
            onSpeedChange={setSpeed}
            onPrevPhase={prevPhase}
            onNextPhase={nextPhase}
          />

          {/* Live Telemetry Panel */}
          <LiveTelemetryPanel waypoint={currentWaypoint} />
        </div>

        {/* Right Column: Control Station & Minimap (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Rescue Command Station C2 Panel */}
          <ControlStationPanel
            phase={phase}
            dataProvider={simulationDataProvider}
          />

          {/* Synchronized 2D Minimap */}
          <SimulatorMinimap
            waypoint={currentWaypoint}
            phase={phase}
          />
        </div>
      </div>

      {/* Mission Debrief Modal on Completion */}
      <MissionDebriefModal
        isOpen={showDebriefModal}
        onClose={() => setShowDebriefModal(false)}
        onReplay={replayMission}
      />
    </div>
  );
};
