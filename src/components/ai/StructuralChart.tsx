"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useMission } from "@/context/MissionContext";
import { TrendingUp } from "lucide-react";

export const StructuralChart: React.FC = () => {
  const { structuralAnalysis } = useMission();

  const isHighRisk = structuralAnalysis.assessment === "HIGH" || structuralAnalysis.assessment === "CRITICAL";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            Rock Strata Deformation Trend
          </span>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 font-semibold rounded-full border ${
            isHighRisk
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          Risk: {structuralAnalysis.assessment}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
          <span className="text-slate-400 text-[11px] block font-medium">Displacement</span>
          <span className={`text-base font-bold font-mono mt-0.5 block ${isHighRisk ? "text-red-700" : "text-slate-900"}`}>
            {structuralAnalysis.currentDisplacementMm.toFixed(1)} mm
          </span>
        </div>
        <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
          <span className="text-slate-400 text-[11px] block font-medium">Strain Rate</span>
          <span className="text-amber-700 text-base font-bold font-mono mt-0.5 block">
            +{structuralAnalysis.displacementRateMmHr} mm/h
          </span>
        </div>
        <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
          <span className="text-slate-400 text-[11px] block font-medium">AI Confidence</span>
          <span className="text-blue-700 text-base font-bold font-mono mt-0.5 block">
            {structuralAnalysis.aiConfidence}%
          </span>
        </div>
      </div>

      {/* Displacement Chart Area */}
      <div className="h-48 w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-2 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={structuralAnalysis.displacementTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dispGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isHighRisk ? "#ef4444" : "#2563eb"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isHighRisk ? "#ef4444" : "#2563eb"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 12]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", fontSize: "11px", color: "#0f172a", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              itemStyle={{ color: "#2563eb" }}
            />
            <Area
              type="monotone"
              dataKey="displacementMm"
              stroke={isHighRisk ? "#ef4444" : "#2563eb"}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#dispGradient)"
              name="Displacement (mm)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2 font-medium">
        <span>Critical Shear Threshold: <strong className="text-red-700 font-mono">5.0 mm</strong></span>
        <span>Zone: <strong className="text-slate-800">{structuralAnalysis.fractureZone}</strong></span>
      </div>
    </div>
  );
};
