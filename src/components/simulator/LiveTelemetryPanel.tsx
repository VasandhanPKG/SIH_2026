"use client";

import React from "react";
import { SimulatorWaypoint } from "@/lib/simulatorConfig";
import { Flame, Wind, Thermometer, Droplets, Battery, Wifi, Navigation, MapPin } from "lucide-react";

interface LiveTelemetryPanelProps {
  waypoint: SimulatorWaypoint;
}

export const LiveTelemetryPanel: React.FC<LiveTelemetryPanelProps> = ({ waypoint }) => {
  const isMethaneWarning = waypoint.gasCh4 >= 0.8 && waypoint.gasCh4 < 2.0;
  const isMethaneCritical = waypoint.gasCh4 >= 2.0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
            Subsurface Telemetry Matrix
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
          UPLINK LIVE
        </span>
      </div>

      {/* Main Gas Telemetry Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Methane Gas */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isMethaneCritical
              ? "bg-red-50/90 border-red-300 ring-2 ring-red-500/20"
              : isMethaneWarning
              ? "bg-amber-50/90 border-amber-300"
              : "bg-slate-50/80 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-medium">
            <span className="flex items-center gap-1.5">
              <Flame
                className={`h-3.5 w-3.5 ${
                  isMethaneCritical
                    ? "text-red-600 animate-bounce"
                    : isMethaneWarning
                    ? "text-amber-600"
                    : "text-slate-400"
                }`}
              />
              Methane (CH₄)
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                isMethaneCritical
                  ? "bg-red-600 text-white"
                  : isMethaneWarning
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {isMethaneCritical ? "CRITICAL" : isMethaneWarning ? "WARNING" : "SAFE"}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl font-mono font-bold ${
                isMethaneCritical
                  ? "text-red-700"
                  : isMethaneWarning
                  ? "text-amber-700"
                  : "text-slate-900"
              }`}
            >
              {waypoint.gasCh4.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">% LEL</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isMethaneCritical
                  ? "bg-red-600"
                  : isMethaneWarning
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, (waypoint.gasCh4 / 2.5) * 100)}%` }}
            />
          </div>
        </div>

        {/* Oxygen */}
        <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-medium">
            <span className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-blue-500" />
              Oxygen (O₂)
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono bg-emerald-100 text-emerald-800">
              NOMINAL
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-slate-900">
              {waypoint.gasO2.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">% VOL</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, (waypoint.gasO2 / 21.0) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Environmental & Rover Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Temperature */}
        <div className="bg-slate-50/60 border border-slate-100 p-2.5 rounded-xl">
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Thermometer className="h-3 w-3 text-orange-500" />
            Ambient Temp
          </div>
          <div className="font-mono font-bold text-slate-800 mt-1">
            {waypoint.tempC.toFixed(1)} °C
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50/60 border border-slate-100 p-2.5 rounded-xl">
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Droplets className="h-3 w-3 text-cyan-500" />
            Relative Humidity
          </div>
          <div className="font-mono font-bold text-slate-800 mt-1">
            {waypoint.humidityPct}%
          </div>
        </div>

        {/* Battery */}
        <div className="bg-slate-50/60 border border-slate-100 p-2.5 rounded-xl">
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Battery className="h-3 w-3 text-emerald-500" />
            Battery Cell
          </div>
          <div className="font-mono font-bold text-slate-800 mt-1">
            {waypoint.batteryPct.toFixed(1)}%
          </div>
        </div>

        {/* Signal */}
        <div className="bg-slate-50/60 border border-slate-100 p-2.5 rounded-xl">
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Wifi className="h-3 w-3 text-blue-500" />
            Mesh Signal
          </div>
          <div className="font-mono font-bold text-slate-800 mt-1">
            {waypoint.signalPct}% (12ms)
          </div>
        </div>
      </div>

      {/* Exploration & Distance Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-slate-50/80 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase font-mono">Distance Ingress</div>
            <div className="text-sm font-mono font-bold text-slate-900">{waypoint.distanceM.toFixed(1)} meters</div>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase font-mono">3D SLAM Coverage</div>
            <div className="text-sm font-mono font-bold text-emerald-700">{waypoint.mappedPct}% Mapped</div>
          </div>
        </div>
      </div>
    </div>
  );
};
