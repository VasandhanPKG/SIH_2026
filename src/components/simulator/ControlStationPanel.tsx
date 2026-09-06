"use client";

import React from "react";
import { MissionPhaseKey, ISimulationDataProvider } from "@/lib/simulatorConfig";
import { Radio, UserCheck, AlertTriangle, ShieldCheck, Sparkles, Send } from "lucide-react";

interface ControlStationPanelProps {
  phase: MissionPhaseKey;
  dataProvider: ISimulationDataProvider;
}

export const ControlStationPanel: React.FC<ControlStationPanelProps> = ({ phase, dataProvider }) => {
  const detection = dataProvider.getDetectionData(phase);
  const analysis = dataProvider.getAnalysisData(phase);

  const isConnected = phase === "CONNECT" || phase === "COMPLETE";
  const isRouteReady = phase === "ANALYSE" || phase === "CONNECT" || phase === "COMPLETE";

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-blue-600 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
            Rescue Command Station (Subsurface C2)
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
          STATION ONLINE
        </span>
      </div>

      {/* Core SIH Motto Banner */}
      <div className="p-3 bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl text-white shadow-sm flex items-center gap-3">
        <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-400/40">
          <Sparkles className="h-4 w-4 text-cyan-300" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
            Core Design Philosophy
          </div>
          <p className="text-xs font-bold text-white tracking-tight">
            &ldquo;Don&apos;t send humans first. Send intelligence first.&rdquo;
          </p>
        </div>
      </div>

      {/* Status Matrix List */}
      <div className="space-y-2 text-xs">
        {/* Rover Uplink */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
          <span className="text-slate-600 font-medium flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Rover 01 Ad-Hoc Link
          </span>
          <span className="font-mono font-bold text-emerald-700">CONNECTED (12ms)</span>
        </div>

        {/* Human Detection Status */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
            detection.humanDetected
              ? "bg-red-50/90 border-red-200 text-red-900"
              : "bg-slate-50 border-slate-100 text-slate-600"
          }`}
        >
          <span className="font-medium flex items-center gap-2">
            <UserCheck
              className={`h-4 w-4 ${detection.humanDetected ? "text-red-600" : "text-slate-400"}`}
            />
            Survivor Detection
          </span>
          <span className="font-mono font-bold">
            {detection.humanDetected ? "PRSN-01 (37.2°C • 95% Conf)" : "Scanning Drift..."}
          </span>
        </div>

        {/* Risk Assessment */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
            analysis.riskLevel === "HIGH"
              ? "bg-amber-50/90 border-amber-200 text-amber-900"
              : "bg-slate-50 border-slate-100 text-slate-600"
          }`}
        >
          <span className="font-medium flex items-center gap-2">
            <AlertTriangle
              className={`h-4 w-4 ${analysis.riskLevel === "HIGH" ? "text-amber-600" : "text-slate-400"}`}
            />
            Risk Assessment
          </span>
          <span className="font-mono font-bold">
            {analysis.riskLevel === "HIGH" ? "HIGH (CH4 Surge + 8.4mm Shear)" : "NOMINAL"}
          </span>
        </div>

        {/* Safe Route Planning */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
            isRouteReady
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
              : "bg-slate-50 border-slate-100 text-slate-600"
          }`}
        >
          <span className="font-medium flex items-center gap-2">
            <ShieldCheck
              className={`h-4 w-4 ${isRouteReady ? "text-emerald-600" : "text-slate-400"}`}
            />
            Recommended Rescue Path
          </span>
          <span className="font-mono font-bold text-emerald-700">
            {isRouteReady ? "ROUTE B (100% SAFE BYPASS)" : "Evaluating..."}
          </span>
        </div>
      </div>

      {/* Control Station Action Status */}
      <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>DATA TRANSMISSION STATUS</span>
          <span className={isConnected ? "text-emerald-400 font-bold" : "text-blue-400"}>
            {isConnected ? "● SYNCED 100%" : "STREAMING TELEMETRY"}
          </span>
        </div>
        <div className="text-[11px] text-slate-200">
          {isConnected
            ? "Extraction dossier dispatched to Rapid Response Rescue Brigade."
            : "Live atmospheric & LiDAR telemetry streaming to surface command."}
        </div>
      </div>
    </div>
  );
};
