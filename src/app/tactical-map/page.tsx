"use client";

import React from "react";
import { TacticalMineMap } from "@/components/map/TacticalMineMap";
import { useMission } from "@/context/MissionContext";
import { Map } from "lucide-react";

export default function TacticalMapPage() {
  const { telemetry } = useMission();

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4 select-none font-sans">
      {/* Top Header Strip */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Tactical SLAM Cartography
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Real-time LiDAR point cloud registration and dynamic safety corridor routing.
            </p>
          </div>
        </div>

        {/* Quick HUD status strip */}
        <div className="hidden md:flex items-center gap-4 text-xs bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-subtle">
          <div>
            <span className="text-slate-400">Position:</span>{" "}
            <strong className="text-blue-700 font-semibold font-mono">
              X:{telemetry.position.x.toFixed(0)} Y:{telemetry.position.y.toFixed(0)} ({telemetry.position.sector})
            </strong>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">Depth:</span>{" "}
            <strong className="text-slate-900 font-semibold font-mono">{telemetry.depthMeters}m</strong>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">Exploration:</span>{" "}
            <strong className="text-emerald-700 font-semibold font-mono">{telemetry.exploredAreaPct}%</strong>
          </div>
        </div>
      </div>

      {/* Full-bleed Map Canvas */}
      <div className="flex-1 w-full relative min-h-0 bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
        <TacticalMineMap compact={false} className="h-full w-full" />
      </div>
    </div>
  );
}
