"use client";

import React, { useState } from "react";
import { useMission } from "@/context/MissionContext";
import { TacticalMineMap } from "@/components/map/TacticalMineMap";
import { CameraFeed } from "@/components/rover/CameraFeed";
import { DemoTimeline } from "@/components/demo/DemoTimeline";
import { DemoControlBar } from "@/components/demo/DemoControlBar";
import { MissionSummaryModal } from "@/components/demo/MissionSummaryModal";
import { SafePathCard } from "@/components/ai/SafePathCard";
import { PowerTelemetry } from "@/components/rover/PowerTelemetry";
import { GasGauge } from "@/components/dashboard/GasGauge";
import { HowRoverWorks } from "@/components/demo/HowRoverWorks";
import { MineRescueSimulator } from "@/components/simulator/MineRescueSimulator";
import {
  Sparkles,
  Rocket,
  CheckCircle2,
  Cpu,
  Navigation,
  Layers,
  BookOpen,
  PlayCircle,
} from "lucide-react";

export default function DemoPage() {
  const {
    currentStage,
    currentStageIndex,
    isDemoPlaying,
    startMission,
    telemetry,
    persons,
  } = useMission();

  const [activeTab, setActiveTab] = useState<"3D_SIMULATION" | "STAGE_DEMO" | "HOW_IT_WORKS">("3D_SIMULATION");
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [hasShownModalForStage8, setHasShownModalForStage8] = useState<boolean>(false);

  const isStage8Complete = currentStageIndex === 7;

  // Auto trigger modal once when reaching stage 8
  React.useEffect(() => {
    if (isStage8Complete && !isDemoPlaying && !hasShownModalForStage8) {
      setShowSummaryModal(true);
      setHasShownModalForStage8(true);
    } else if (currentStageIndex < 7) {
      setHasShownModalForStage8(false);
    }
  }, [isStage8Complete, isDemoPlaying, hasShownModalForStage8, currentStageIndex]);

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Demo Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Mission Simulation & Rover Architecture</span>
            </h1>
            <span className="text-xs bg-blue-50 border border-blue-200/80 text-blue-700 px-2.5 py-0.5 font-semibold rounded-full">
              SIH 2026 Evaluation Demo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Autonomous underground mine rescue rover • Sector 7B • Depth -740m
          </p>
        </div>

        {/* Tab Switcher & Ready / Start Mission Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab("3D_SIMULATION")}
              className={`px-3.5 py-1.5 font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === "3D_SIMULATION"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PlayCircle className="h-3.5 w-3.5" />
              <span>3D Simulation</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeTab === "3D_SIMULATION" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>3D</span>
            </button>
            <button
              onClick={() => setActiveTab("STAGE_DEMO")}
              className={`px-3.5 py-1.5 font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === "STAGE_DEMO"
                  ? "bg-white text-blue-700 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>8-Stage Demo</span>
            </button>
            <button
              onClick={() => setActiveTab("HOW_IT_WORKS")}
              className={`px-3.5 py-1.5 font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === "HOW_IT_WORKS"
                  ? "bg-white text-blue-700 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>How Rover Works</span>
            </button>
          </div>

          {activeTab === "STAGE_DEMO" && (
            <>
              {isStage8Complete && (
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 rounded-xl transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              )}

              <button
                onClick={startMission}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95"
              >
                <Rocket className="h-4 w-4" />
                <span>{isDemoPlaying ? "Mission Running..." : "Start Stage Demo"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === "3D_SIMULATION" ? (
        /* Interactive 3D Mine Rescue Simulator */
        <MineRescueSimulator />
      ) : activeTab === "HOW_IT_WORKS" ? (
        /* How Rover Works Explorer */
        <HowRoverWorks />
      ) : (
        /* Live 8-Stage Mission Simulation View */
        <div className="space-y-6">
          {/* 8-Stage Interactive Timeline */}
          <DemoTimeline />

          {/* Synchronized Tactical Command Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Large Dynamic Tactical Map (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col h-[520px] shadow-subtle">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-800 tracking-tight">
                      Tactical SLAM Reconnaissance
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                    Speed: {telemetry.speed.toFixed(1)} m/s
                  </span>
                </div>

                <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden">
                  <TacticalMineMap compact={false} />
                </div>
              </div>

              {/* Gas Monitors */}
              <GasGauge />
            </div>

            {/* Right Column: Multi-Spectral Camera Feed + Safe Path / Rescue Alert (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Synchronized Camera Feed (Switches to Thermal in Stage 5/7) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-subtle">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
                  <span className="text-slate-800 font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-600" />
                    <span>Sensor Stream ({currentStage.cameraMode})</span>
                  </span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {persons.length > 0 ? "Survivor Confirmed" : "Scanning"}
                  </span>
                </div>
                <div className="h-[290px] rounded-xl overflow-hidden">
                  <CameraFeed showAiOverlay={true} />
                </div>
              </div>

              {/* AI Safe Route Synthesis & Rescue Team Dispatch */}
              <SafePathCard />

              {/* Telemetry Snapshot */}
              <PowerTelemetry />
            </div>
          </div>

          {/* Bottom Sticky Control Bar */}
          <div className="sticky bottom-3 z-30">
            <DemoControlBar />
          </div>

          {/* Mission Completed Summary Modal */}
          <MissionSummaryModal
            isOpen={showSummaryModal}
            onClose={() => setShowSummaryModal(false)}
          />
        </div>
      )}
    </div>
  );
}
