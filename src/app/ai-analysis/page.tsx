"use client";

import React from "react";
import { CameraFeed } from "@/components/rover/CameraFeed";
import { StructuralChart } from "@/components/ai/StructuralChart";
import { SafePathCard } from "@/components/ai/SafePathCard";
import { DetectionList } from "@/components/ai/DetectionList";
import { Cpu, Eye } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export default function AiAnalysisPage() {
  const { currentStage } = useMission();

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI Sensor Fusion & Risk Analysis
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Edge YOLO-v9 object classification, stereoscopic rock fracture deformation analysis, and pathfinding heuristics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs shadow-subtle font-medium">
          <span className="text-slate-400">Inference:</span>
          <span className="text-blue-700 font-semibold font-mono">28.4 FPS (TensorRT)</span>
          <span className="text-slate-200">|</span>
          <span className="text-emerald-700 font-semibold font-mono">Conf: 95.2%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Detection Video Feed & Structural Graph (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span>Live Sensor Fusion Stream — Sector 7B</span>
              </span>
              <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 font-semibold rounded-full">
                {currentStage.title}
              </span>
            </div>
            <div className="h-[380px] rounded-xl overflow-hidden">
              <CameraFeed showAiOverlay={true} />
            </div>
          </div>

          <StructuralChart />
        </div>

        {/* Right Column: Safe Path Planning & Detection Roster (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <SafePathCard />
          <DetectionList />
        </div>
      </div>
    </div>
  );
}
