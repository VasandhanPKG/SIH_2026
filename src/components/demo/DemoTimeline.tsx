"use client";

import React from "react";
import { DEMO_STAGES } from "@/lib/demoScript";
import { useMission } from "@/context/MissionContext";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

export const DemoTimeline: React.FC = () => {
  const { currentStageIndex, skipStage, isDemoPlaying, demoProgressSec, currentStage } = useMission();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            8-Stage Autonomous Rescue Simulation
          </span>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
          Stage {currentStageIndex + 1} of 8
        </span>
      </div>

      {/* Interactive Stage Step Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
        {DEMO_STAGES.map((stg, idx) => {
          const isCurrent = idx === currentStageIndex;
          const isPassed = idx < currentStageIndex;
          const stageDuration = stg.durationSec;
          const progressPercent = isCurrent
            ? Math.min(100, (demoProgressSec / stageDuration) * 100)
            : isPassed
            ? 100
            : 0;

          return (
            <button
              key={stg.key}
              onClick={() => skipStage(idx)}
              className={`relative flex flex-col p-2.5 text-left rounded-xl transition-all text-xs overflow-hidden border ${
                isCurrent
                  ? "bg-blue-50/80 border-blue-400 text-blue-900 shadow-sm"
                  : isPassed
                  ? "bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300"
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
              }`}
            >
              {/* Progress fill bar */}
              <div
                className="absolute bottom-0 left-0 top-0 bg-blue-200/40 pointer-events-none transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />

              <div className="flex items-center justify-between mb-1.5 z-10">
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  S{idx + 1}
                </span>
                {isPassed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                ) : (
                  <Circle className="h-3 w-3 text-slate-300" />
                )}
              </div>

              <span className={`text-[11px] font-semibold truncate z-10 ${isCurrent ? "text-blue-900 font-bold" : ""}`}>
                {stg.title.split(":")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Description Banner */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full">
              Active Stage
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {currentStage.title}
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-4xl font-normal">
            {currentStage.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200/80">
          <span>Progress:</span>
          <span className="font-mono font-bold text-blue-700">
            {Math.floor(demoProgressSec)}s / {currentStage.durationSec}s
          </span>
        </div>
      </div>
    </div>
  );
};
