"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Wifi,
  Clock,
  AlertOctagon,
  Play,
  Pause,
  ChevronRight,
  Radio,
  Sparkles,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { EmergencyStopModal } from "./EmergencyStopModal";
import Link from "next/link";

export const TopBar: React.FC = () => {
  const {
    mode,
    setMode,
    telemetry,
    currentStage,
    currentStageIndex,
    isDemoPlaying,
    isEmergencyStopped,
    playbackSpeed,
    setPlaybackSpeed,
    playDemo,
    pauseDemo,
    nextStage,
  } = useMission();

  const [timeStr, setTimeStr] = useState<string>("");
  const [showEStopModal, setShowEStopModal] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(d.toISOString().substring(11, 19) + " UTC");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/90 px-5 backdrop-blur-md shadow-sm">
        {/* Left: Branding & Mission Badge */}
        <div className="flex items-center gap-5">
          <Link href="/overview" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/25 group-hover:bg-blue-700 transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Mine Rescue Command
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                  SIH 26039
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Autonomous Rover C2 • Sector 7B (-740m)
              </p>
            </div>
          </Link>

          {/* Mission Mode / Status Pill */}
          <div className="hidden lg:flex items-center">
            {isEmergencyStopped ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Emergency Lockdown Active
              </div>
            ) : mode === "DEMO" ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Simulation Stage {currentStageIndex + 1}/8</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Hardware Stream</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean Simulation Controller (if Demo Mode) */}
        {mode === "DEMO" && (
          <div className="hidden xl:flex items-center gap-3 bg-slate-100/90 border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-sm text-xs">
            <span className="text-slate-500 font-medium text-[11px]">Active Stage:</span>
            <span className="text-slate-900 font-semibold max-w-[240px] truncate">
              {currentStage.title}
            </span>

            <div className="flex items-center gap-1.5 border-l border-slate-300/80 pl-3">
              <button
                onClick={isDemoPlaying ? pauseDemo : playDemo}
                className={`p-1.5 rounded-full transition-all ${
                  isDemoPlaying
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
                title={isDemoPlaying ? "Pause Simulation" : "Play Simulation"}
              >
                {isDemoPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              </button>
              <button
                onClick={nextStage}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-full transition-all"
                title="Next Stage"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 5 : 1)}
                className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:text-blue-700 rounded-md bg-white border border-slate-200 shadow-sm"
                title="Change Speed"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        )}

        {/* Right Section: Telemetry Signal, Time, Mode Toggle & Emergency Stop */}
        <div className="flex items-center gap-3">
          {/* Signal & Clock widget */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 bg-slate-100/70 border border-slate-200/80 px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5" title="Mesh Signal Strength">
              <Wifi className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold text-slate-800 font-mono">{telemetry.signalStrength}%</span>
              <span className="text-[10px] text-slate-400 font-mono">({telemetry.latency}ms)</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="flex items-center gap-1.5 text-slate-600" title="UTC Mission Clock">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium font-mono text-[11px] text-slate-700">{timeStr || "00:00:00 UTC"}</span>
            </div>
          </div>

          {/* Mode Switch: Live vs Demo */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMode("DEMO")}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === "DEMO"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Demo Sim
            </button>
            <button
              onClick={() => setMode("LIVE")}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === "LIVE"
                  ? "bg-white text-blue-700 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Live Hardware
            </button>
          </div>

          {/* Emergency Stop Button */}
          <button
            onClick={() => setShowEStopModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 ${
              isEmergencyStopped
                ? "bg-red-600 text-white animate-pulse hover:bg-red-700"
                : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            <AlertOctagon className="h-4 w-4 text-red-600" />
            <span>{isEmergencyStopped ? "E-STOP ACTIVE" : "E-Stop"}</span>
          </button>
        </div>
      </header>

      <EmergencyStopModal
        isOpen={showEStopModal}
        onClose={() => setShowEStopModal(false)}
      />
    </>
  );
};
