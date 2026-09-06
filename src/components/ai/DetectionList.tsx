"use client";

import React from "react";
import { User, Flame } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const DetectionList: React.FC = () => {
  const { persons, hazards, selectEntity } = useMission();

  return (
    <div className="space-y-5 select-none font-sans">
      {/* Human / Survivor Detections */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-subtle">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">
              Survivor Identification
            </span>
          </div>
          <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
            {persons.length} Located
          </span>
        </div>

        {persons.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            No survivors detected in current sector range. LiDAR and thermal sensor sweeps active...
          </p>
        ) : (
          <div className="space-y-2.5">
            {persons.map((p) => (
              <div
                key={p.id}
                onClick={() => selectEntity("PERSON", p.id)}
                className="p-4 bg-red-50/40 border border-red-200/80 hover:border-red-400 rounded-xl cursor-pointer transition-all space-y-2.5 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span>{p.id} ({p.callsign})</span>
                  </span>
                  <span className="text-[10px] bg-red-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <div>Confidence: <strong className="font-mono text-emerald-700">{p.confidence}%</strong></div>
                  <div>Heat Sig: <strong className="font-mono text-amber-700">{p.thermalTempC ?? 37.2}°C</strong></div>
                  <div>Location: <strong className="text-slate-800">{p.location.label}</strong></div>
                  <div>Distance: <strong className="font-mono text-blue-700">{p.distanceMeters}m</strong></div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Source: <strong className="text-slate-700 font-medium">{p.detectionSource}</strong></span>
                  <span className="text-blue-600 font-semibold hover:underline">Focus on Map</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hazards Detections */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-subtle">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">
              Hazards & Anomalies
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
            {hazards.length} Detected
          </span>
        </div>

        {hazards.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            Atmospheric and strata conditions nominal. No lethal hazards flagged.
          </p>
        ) : (
          <div className="space-y-2.5">
            {hazards.map((h) => (
              <div
                key={h.id}
                onClick={() => selectEntity("HAZARD", h.id)}
                className="p-4 bg-amber-50/40 border border-amber-200/80 hover:border-amber-400 rounded-xl cursor-pointer transition-all space-y-2 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{h.title}</span>
                  <span className="text-[10px] font-semibold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                    {h.severity}
                  </span>
                </div>
                <div className="text-xs text-slate-800">
                  Reading: <span className="text-red-600 font-mono font-bold">{h.valueDisplay}</span> ({h.location.label})
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{h.recommendedAction}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
