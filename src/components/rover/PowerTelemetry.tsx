"use client";

import React from "react";
import { Battery, Zap, Compass, Activity, Thermometer, Flame, Gauge } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const PowerTelemetry: React.FC = () => {
  const { telemetry } = useMission();

  const isMethaneWarning = telemetry.gas.ch4 > 1.0;
  const isHighTemp = telemetry.temperature > 42.0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            Rover Telemetry
          </span>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
          {telemetry.status}
        </span>
      </div>

      {/* Primary Battery Cell */}
      <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 flex items-center gap-1.5 font-medium">
            <Battery className="h-4 w-4 text-blue-600" />
            Power Cell Pack
          </span>
          <span className={`font-mono font-bold text-sm ${telemetry.battery < 25 ? "text-red-600" : "text-blue-700"}`}>
            {telemetry.battery.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 overflow-hidden rounded-full">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              telemetry.battery < 25 ? "bg-red-500" : "bg-blue-600"
            }`}
            style={{ width: `${telemetry.battery}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-500">
          <div>Draw: <strong className="font-mono text-slate-800">{telemetry.powerDrawKw.toFixed(1)} kW</strong></div>
          <div>Est. Runtime: <strong className="font-mono text-emerald-700">4h 12m</strong></div>
        </div>
      </div>

      {/* Motors & LiDAR */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
          <span className="text-slate-400 text-[11px] block font-medium">Drive Motors</span>
          <span className="text-slate-900 font-bold text-sm flex items-center gap-1 mt-0.5 font-mono">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            {telemetry.motorCurrent.toFixed(1)} A
          </span>
        </div>
        <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
          <span className="text-slate-400 text-[11px] block font-medium">LiDAR Rate</span>
          <span className="text-blue-700 font-bold text-sm flex items-center gap-1 mt-0.5 font-mono">
            <Gauge className="h-3.5 w-3.5 text-blue-600" />
            {telemetry.lidarRateHz} Hz
          </span>
        </div>
      </div>

      {/* IMU Stability */}
      <div className="bg-slate-50/70 border border-slate-200/80 p-3 space-y-2 rounded-xl">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            IMU 3-Axis Acceleration
          </span>
          <span className="text-emerald-700 font-semibold text-[11px]">Stable</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
          <div className="bg-white p-1.5 border border-slate-200/80 rounded-lg shadow-subtle">
            <span className="text-slate-400 text-[10px] block">X</span>
            <span className="text-blue-700 font-bold">
              {telemetry.imu.accelX >= 0 ? `+${telemetry.imu.accelX.toFixed(2)}` : telemetry.imu.accelX.toFixed(2)}
            </span>
          </div>
          <div className="bg-white p-1.5 border border-slate-200/80 rounded-lg shadow-subtle">
            <span className="text-slate-400 text-[10px] block">Y</span>
            <span className="text-blue-700 font-bold">
              {telemetry.imu.accelY >= 0 ? `+${telemetry.imu.accelY.toFixed(2)}` : telemetry.imu.accelY.toFixed(2)}
            </span>
          </div>
          <div className="bg-white p-1.5 border border-slate-200/80 rounded-lg shadow-subtle">
            <span className="text-slate-400 text-[10px] block">Z</span>
            <span className="text-blue-700 font-bold">
              +{telemetry.imu.accelZ.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Temperature */}
      <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl flex items-center justify-between text-xs">
        <span className="text-slate-600 flex items-center gap-1.5 font-medium">
          <Thermometer className="h-4 w-4 text-amber-500" />
          Ambient Drift Temperature
        </span>
        <span className={`font-mono font-bold text-sm ${isHighTemp ? "text-red-600" : "text-slate-900"}`}>
          {telemetry.temperature.toFixed(1)}°C
        </span>
      </div>
    </div>
  );
};
