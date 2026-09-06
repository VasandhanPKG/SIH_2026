"use client";

import React from "react";
import { Flame, Wind, ShieldAlert } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const GasGauge: React.FC = () => {
  const { telemetry } = useMission();

  const isCh4High = telemetry.gas.ch4 > 1.0;
  const isCoHigh = telemetry.gas.co > 50;
  const isO2Low = telemetry.gas.o2 < 19.5;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Atmospheric Gas Sensors
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Continuous multi-gas pellistor & electrochemical telemetry
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full">
          DGMS Compliant
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        {/* METHANE CH4 */}
        <div
          className={`p-4 rounded-xl text-center border transition-all ${
            isCh4High
              ? "bg-red-50/80 border-red-200 text-red-700"
              : "bg-slate-50/70 border-slate-200/80 text-slate-800"
          }`}
        >
          <span className="text-[11px] text-slate-500 block font-semibold">Methane (CH4)</span>
          <span className={`text-2xl font-bold my-1 block font-mono ${isCh4High ? "text-red-700" : "text-slate-900"}`}>
            {telemetry.gas.ch4.toFixed(1)}%
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
            isCh4High ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
          }`}>
            {isCh4High ? "Critical Flammability" : "Nominal (Safe)"}
          </span>
        </div>

        {/* CARBON MONOXIDE CO */}
        <div
          className={`p-4 rounded-xl text-center border transition-all ${
            isCoHigh
              ? "bg-red-50/80 border-red-200 text-red-700"
              : "bg-slate-50/70 border-slate-200/80 text-slate-800"
          }`}
        >
          <span className="text-[11px] text-slate-500 block font-semibold">Carbon Monoxide (CO)</span>
          <span className="text-2xl font-bold my-1 block font-mono text-slate-900">
            {telemetry.gas.co} <span className="text-xs font-medium text-slate-500">ppm</span>
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block">
            Safe (&lt;50 ppm)
          </span>
        </div>

        {/* OXYGEN O2 */}
        <div
          className={`p-4 rounded-xl text-center border transition-all ${
            isO2Low
              ? "bg-amber-50/80 border-amber-200 text-amber-800"
              : "bg-slate-50/70 border-slate-200/80 text-slate-800"
          }`}
        >
          <span className="text-[11px] text-slate-500 block font-semibold">Oxygen (O2)</span>
          <span className="text-2xl font-bold my-1 block font-mono text-slate-900">
            {telemetry.gas.o2.toFixed(1)}%
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block">
            Optimal (19.5% - 21%)
          </span>
        </div>
      </div>
    </div>
  );
};
