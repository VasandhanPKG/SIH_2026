"use client";

import React from "react";
import { MissionPhaseKey, FIVE_PILLARS } from "@/lib/simulatorConfig";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FastForward } from "lucide-react";

interface SimulationControlsProps {
  phase: MissionPhaseKey;
  isPlaying: boolean;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onPrevPhase: () => void;
  onNextPhase: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  phase,
  isPlaying,
  speed,
  onStart,
  onPause,
  onResume,
  onReplay,
  onSpeedChange,
  onPrevPhase,
  onNextPhase,
}) => {
  const currentIdx = FIVE_PILLARS.findIndex((p) => p.id === phase);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 font-sans">
      {/* Primary Action Button */}
      <div className="flex items-center gap-3">
        {phase === "READY" ? (
          <button
            onClick={onStart}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Start Mission</span>
          </button>
        ) : phase === "COMPLETE" ? (
          <button
            onClick={onReplay}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay Mission</span>
          </button>
        ) : isPlaying ? (
          <button
            onClick={onPause}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Pause className="h-4 w-4 fill-white" />
            <span>Pause Mission</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Resume Mission</span>
          </button>
        )}

        <button
          onClick={onReplay}
          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 rounded-xl transition-colors"
          title="Reset to Initial State"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Stage Stepper Buttons */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
        <button
          onClick={onPrevPhase}
          disabled={currentIdx <= 0}
          className="px-2.5 py-1.5 font-medium rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <span className="px-2 font-mono font-bold text-slate-800">
          {phase === "READY" ? "READY" : phase === "COMPLETE" ? "DONE" : `0${currentIdx + 1}/05`}
        </span>
        <button
          onClick={onNextPhase}
          disabled={currentIdx >= FIVE_PILLARS.length - 1}
          className="px-2.5 py-1.5 font-medium rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Speed Multiplier Toggles */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
        <div className="px-2 text-[10px] font-mono text-slate-500 font-bold flex items-center gap-1">
          <FastForward className="h-3 w-3" />
          Speed:
        </div>
        {[1, 2, 5].map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2.5 py-1 font-mono font-bold rounded-lg transition-all ${
              speed === s
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
