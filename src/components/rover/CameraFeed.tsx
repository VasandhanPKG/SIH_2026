"use client";

import React, { useState } from "react";
import { useMission } from "@/context/MissionContext";
import { Eye, Video, Crosshair, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

interface CameraFeedProps {
  showAiOverlay?: boolean;
  className?: string;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ showAiOverlay = true, className = "" }) => {
  const { cameraMode, setCameraMode, telemetry, persons, hazards } = useMission();

  const hasSurvivor = persons.length > 0;
  const hasHazard = hazards.length > 0;

  return (
    <div className={`relative w-full h-full min-h-[380px] bg-[#0c1a2e] border border-slate-200 rounded-lg overflow-hidden select-none font-mono shadow-inner ${className}`}>
      {/* Top Camera Controls & Mode Selector Tabs */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="flex bg-white/95 border border-slate-200 p-0.5 rounded-md shadow-sm">
          <button
            onClick={() => setCameraMode("RGB")}
            className={`px-3 py-1 text-xs font-bold transition-all uppercase rounded ${
              cameraMode === "RGB"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            RGB OPTICAL
          </button>
          <button
            onClick={() => setCameraMode("THERMAL")}
            className={`px-3 py-1 text-xs font-bold transition-all uppercase flex items-center gap-1.5 rounded ${
              cameraMode === "THERMAL"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-red-600"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
            FLIR THERMAL
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white/95 border border-slate-200 px-2.5 py-1 text-[11px] text-slate-700 rounded-md shadow-sm font-semibold">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>REC: 24:08:11</span>
        </div>
      </div>

      {/* Top Right Telemetry Overlay */}
      <div className="absolute top-3 right-3 z-30 bg-white/95 border border-slate-200 px-3 py-1.5 rounded-md shadow-sm text-right text-[10px] text-slate-700 space-y-0.5 font-semibold">
        <div>AZIMUTH: <span className="text-blue-700 font-bold">{telemetry.headingDeg}°</span></div>
        <div>PITCH: <span className="text-slate-900 font-bold">{telemetry.imu.pitch}°</span> | ROLL: {telemetry.imu.roll}°</div>
        <div>DEPTH: <span className="text-amber-700 font-bold">{telemetry.depthMeters}m</span></div>
      </div>

      {/* Camera Rendering Canvas View */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {cameraMode === "RGB" ? (
          // RGB MINE DRIFT VIEW
          <div
            className="w-full h-full bg-[#0a192f] relative flex items-center justify-center"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 50% 50%, rgba(30, 58, 138, 0.4) 0%, rgba(10, 25, 47, 0.95) 85%),
                linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)
              `,
            }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 500">
              <line x1="0" y1="0" x2="400" y2="250" stroke="#38bdf8" strokeWidth="2" />
              <line x1="800" y1="0" x2="400" y2="250" stroke="#38bdf8" strokeWidth="2" />
              <line x1="0" y1="500" x2="400" y2="250" stroke="#38bdf8" strokeWidth="2" />
              <line x1="800" y1="500" x2="400" y2="250" stroke="#38bdf8" strokeWidth="2" />
              <ellipse cx="400" cy="250" rx="90" ry="60" fill="none" stroke="#60a5fa" strokeWidth="2" />
              <ellipse cx="400" cy="250" rx="180" ry="120" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            </svg>

            <div
              className="absolute w-[360px] h-[360px] rounded-full opacity-20 pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%)",
              }}
            />
          </div>
        ) : (
          // FLIR THERMAL HEATMAP VIEW
          <div
            className="w-full h-full bg-[#13031a] relative flex items-center justify-center"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 50% 50%, rgba(120, 20, 90, 0.3) 0%, rgba(10, 2, 20, 0.98) 90%),
                linear-gradient(45deg, rgba(20, 0, 40, 0.6) 0%, rgba(80, 10, 40, 0.4) 100%)
              `,
            }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 800 500">
              <line x1="0" y1="0" x2="400" y2="250" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="800" y1="0" x2="400" y2="250" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="0" y1="500" x2="400" y2="250" stroke="#db2777" strokeWidth="1.5" />
              <line x1="800" y1="500" x2="400" y2="250" stroke="#db2777" strokeWidth="1.5" />
            </svg>

            <div className="absolute right-4 top-16 bottom-16 w-3 border border-slate-700 bg-gradient-to-t from-blue-900 via-purple-600 via-amber-400 to-red-500 z-20 flex flex-col justify-between text-[8px] font-mono text-white px-3 py-1 select-none rounded">
              <span>+45°C</span>
              <span>+37°C</span>
              <span>+20°C</span>
              <span>+10°C</span>
            </div>

            {hasSurvivor && (
              <div className="absolute flex flex-col items-center justify-center animate-pulse">
                <div
                  className="w-16 h-28 rounded-3xl"
                  style={{
                    background: "radial-gradient(circle, #facc15 15%, #ef4444 60%, #9333ea 90%)",
                    filter: "blur(4px)",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tactical Crosshair in Center */}
        <div className="absolute pointer-events-none flex items-center justify-center z-20">
          <Crosshair className="h-14 w-14 text-sky-400/50 stroke-[1]" />
          <div className="absolute w-2 h-2 border-t border-l border-sky-400" />
          <div className="absolute w-2 h-2 border-t border-r border-sky-400" />
          <div className="absolute w-2 h-2 border-b border-l border-sky-400" />
          <div className="absolute w-2 h-2 border-b border-r border-sky-400" />
        </div>

        {/* AI Bounding Boxes Overlay */}
        {showAiOverlay && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {hasSurvivor && (
              <div className="absolute top-[32%] left-[44%] w-32 h-44 border-2 border-red-500 bg-red-500/10 rounded animate-pulse">
                <div className="absolute -top-6 left-0 bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase flex items-center gap-1 shadow-md rounded-t">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  PERSON 95% (37.2°C)
                </div>
                <div className="absolute -bottom-5 left-0 text-[8px] text-white font-mono bg-slate-900/90 px-1.5 py-0.5 rounded">
                  DIST: 42m | REF-7B
                </div>
              </div>
            )}

            {hasHazard && (
              <div className="absolute top-[18%] left-[22%] w-28 h-20 border-2 border-amber-500 bg-amber-500/10 rounded">
                <div className="absolute -top-5 left-0 bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold text-slate-950 uppercase rounded-t">
                  FRACTURE 92% (8.4mm)
                </div>
              </div>
            )}

            {telemetry.gas.ch4 > 1.0 && (
              <div className="absolute top-[20%] right-[22%] w-36 h-24 border border-dashed border-red-400 bg-red-950/20 rounded">
                <div className="absolute -top-5 left-0 bg-red-700 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase flex items-center gap-1 rounded-t">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  CH4 ANOMALY 2.4%
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Camera Telemetry Strip */}
      <div className="absolute bottom-2 left-3 right-3 z-30 flex items-center justify-between bg-white/95 border border-slate-200 px-3 py-1 rounded-md text-[10px] text-slate-600 font-mono shadow-sm font-semibold">
        <div className="flex items-center gap-3">
          <span>LAT: 23°47'12.4" N</span>
          <span>LON: 86°24'35.8" E</span>
          <span className="text-blue-700 font-bold">FPS: 28.4</span>
        </div>
        <div className="flex items-center gap-2">
          <span>EXPOSURE: <strong className="text-slate-900">AUTO</strong></span>
          <span>STREAM: <strong className="text-emerald-700">RTSP LIVE</strong></span>
        </div>
      </div>
    </div>
  );
};
