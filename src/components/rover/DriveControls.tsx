"use client";

import React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square, Navigation } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const DriveControls: React.FC = () => {
  const { driveRover, telemetry, setNavMode, isEmergencyStopped } = useMission();

  const isManual = telemetry.status === "MANUAL";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-4">
      {/* Mode Selection */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Navigation className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            Navigation Mode
          </span>
        </div>
        <div className="flex bg-slate-100 p-1 text-xs rounded-xl border border-slate-200">
          <button
            onClick={() => setNavMode("MANUAL")}
            className={`px-3 py-1 font-semibold transition-all rounded-lg ${
              isManual
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setNavMode("AUTO_NAV")}
            className={`px-3 py-1 font-semibold transition-all rounded-lg ${
              !isManual
                ? "bg-white text-blue-700 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Auto-Nav
          </button>
        </div>
      </div>

      {/* D-PAD Controls */}
      <div className="flex flex-col items-center justify-center py-2">
        {/* UP */}
        <button
          onClick={() => driveRover("UP")}
          disabled={isEmergencyStopped}
          className="h-12 w-14 flex items-center justify-center bg-slate-50 hover:bg-blue-50 active:bg-blue-100 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-30"
          title="Drive Forward"
        >
          <ChevronUp className="h-6 w-6" />
        </button>

        {/* LEFT / STOP / RIGHT */}
        <div className="flex items-center gap-2.5 my-2.5">
          <button
            onClick={() => driveRover("LEFT")}
            disabled={isEmergencyStopped}
            className="h-12 w-14 flex items-center justify-center bg-slate-50 hover:bg-blue-50 active:bg-blue-100 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-30"
            title="Turn Left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => driveRover("STOP")}
            disabled={isEmergencyStopped}
            className="h-12 w-14 flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-30"
            title="Brake / Stop"
          >
            <Square className="h-5 w-5 fill-current" />
          </button>

          <button
            onClick={() => driveRover("RIGHT")}
            disabled={isEmergencyStopped}
            className="h-12 w-14 flex items-center justify-center bg-slate-50 hover:bg-blue-50 active:bg-blue-100 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-30"
            title="Turn Right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* DOWN */}
        <button
          onClick={() => driveRover("DOWN")}
          disabled={isEmergencyStopped}
          className="h-12 w-14 flex items-center justify-center bg-slate-50 hover:bg-blue-50 active:bg-blue-100 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-subtle active:scale-95 disabled:opacity-30"
          title="Reverse"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>

      {/* Speed & Heading readout */}
      <div className="grid grid-cols-2 gap-2.5 text-center text-xs bg-slate-50/70 p-3 border border-slate-200/80 rounded-xl">
        <div>
          <span className="text-slate-400 text-[11px] block font-medium">Current Speed</span>
          <span className="text-blue-700 font-bold text-sm font-mono mt-0.5 block">
            {telemetry.speed.toFixed(1)} m/s
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block font-medium">Azimuth Heading</span>
          <span className="text-slate-900 font-bold text-sm font-mono mt-0.5 block">
            {telemetry.headingDeg.toFixed(0)}°
          </span>
        </div>
      </div>
    </div>
  );
};
