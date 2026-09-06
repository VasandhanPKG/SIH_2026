"use client";

import React from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const DemoControlBar: React.FC = () => {
  const {
    isDemoPlaying,
    playDemo,
    pauseDemo,
    restartDemo,
    prevStage,
    nextStage,
    startMission,
    currentStageIndex,
    playbackSpeed,
    setPlaybackSpeed,
  } = useMission();

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-3.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
      {/* Left Mission Launch */}
      <div className="flex items-center gap-2">
        <button
          onClick={startMission}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Rocket className="h-4 w-4" />
          <span>Start Mission</span>
        </button>

        <button
          onClick={restartDemo}
          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 rounded-xl transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Center Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevStage}
          disabled={currentStageIndex === 0}
          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </button>

        <button
          onClick={isDemoPlaying ? pauseDemo : playDemo}
          className={`px-5 py-2 text-xs font-semibold flex items-center gap-2 rounded-xl transition-all shadow-sm active:scale-95 ${
            isDemoPlaying
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
          }`}
        >
          {isDemoPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Play Simulation</span>
            </>
          )}
        </button>

        <button
          onClick={nextStage}
          disabled={currentStageIndex === 7}
          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Right Speed Multiplier */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium text-[11px]">Speed:</span>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                playbackSpeed === spd
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
