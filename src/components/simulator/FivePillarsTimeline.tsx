"use client";

import React from "react";
import { FIVE_PILLARS, MissionPhaseKey } from "@/lib/simulatorConfig";
import { Check, Compass, Eye, ShieldAlert, Cpu, Radio } from "lucide-react";

interface FivePillarsTimelineProps {
  currentPhase: MissionPhaseKey;
  progressPct: number;
  onSelectPhase: (phase: MissionPhaseKey) => void;
}

const PILLAR_ICONS: Record<string, React.ElementType> = {
  EXPLORE: Compass,
  MONITOR: Eye,
  DETECT: ShieldAlert,
  ANALYSE: Cpu,
  CONNECT: Radio,
};

export const FivePillarsTimeline: React.FC<FivePillarsTimelineProps> = ({
  currentPhase,
  progressPct,
  onSelectPhase,
}) => {
  const activePillarIndex = FIVE_PILLARS.findIndex((p) => p.id === currentPhase);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
            5 Core Pillars — Autonomous Underground Rescue Sequence
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 font-mono">
          Phase {Math.max(1, activePillarIndex + 1)} of 5
        </span>
      </div>

      {/* 5 Pillars Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {FIVE_PILLARS.map((pillar, idx) => {
          const isCompleted = activePillarIndex > idx || currentPhase === "COMPLETE";
          const isActive = pillar.id === currentPhase;
          const isFuture = activePillarIndex < idx && currentPhase !== "COMPLETE";
          const Icon = PILLAR_ICONS[pillar.id] || Compass;

          return (
            <button
              key={pillar.id}
              onClick={() => onSelectPhase(pillar.id)}
              className={`relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? "bg-blue-50/80 border-blue-500/80 shadow-sm ring-2 ring-blue-500/20"
                  : isCompleted
                  ? "bg-slate-50/80 border-slate-200 hover:bg-slate-100/80"
                  : "bg-white border-slate-200/60 opacity-60 hover:opacity-100"
              }`}
            >
              {/* Pillar Number & Icon */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {pillar.stepNumber}
                </span>

                <div
                  className={`p-1 rounded-lg ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
              </div>

              {/* Pillar Name & Tagline */}
              <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1">
                {pillar.name}
              </div>
              <p className="text-[11px] text-blue-600 font-semibold italic mt-0.5">
                &ldquo;{pillar.tagline}&rdquo;
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                {pillar.description}
              </p>

              {/* Micro Stage Progress Fill Bar */}
              {isActive && (
                <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden mt-2.5">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-200"
                    style={{ width: `${progressPct * 100}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
