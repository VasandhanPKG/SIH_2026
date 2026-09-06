"use client";

import React from "react";
import { useMission } from "@/context/MissionContext";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GasGauge } from "@/components/dashboard/GasGauge";
import { RecentEvents } from "@/components/dashboard/RecentEvents";
import { TacticalMineMap } from "@/components/map/TacticalMineMap";
import { PowerTelemetry } from "@/components/rover/PowerTelemetry";
import { SafePathCard } from "@/components/ai/SafePathCard";
import {
  Shield,
  Battery,
  Wifi,
  Users,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const {
    telemetry,
    hazards,
    persons,
    structuralAnalysis,
  } = useMission();

  const isStructuralHigh = structuralAnalysis.assessment === "HIGH" || structuralAnalysis.assessment === "CRITICAL";

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Mission Control Overview
            </h1>
            <span className="text-xs bg-blue-50 border border-blue-200/80 text-blue-700 px-2.5 py-0.5 font-semibold rounded-full">
              Sector 7B
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Real-time subsurface autonomous rover telemetry and safety monitoring station.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/simulation"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-2 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>Launch 3D Simulation</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded font-mono">3D</span>
          </Link>
          <Link
            href="/demo"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 rounded-xl transition-all shadow-sm"
          >
            <span>8-Stage Demo</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <KpiCard
          title="Active Rover"
          value="1 / 1"
          subtitle="Rover-01 Online"
          icon={Shield}
          variant="blue"
          badge="ARES-V"
        />
        <KpiCard
          title="Battery Cell"
          value={`${telemetry.battery.toFixed(1)}%`}
          subtitle="4h 12m runtime"
          icon={Battery}
          variant={telemetry.battery < 25 ? "red" : "green"}
        />
        <KpiCard
          title="Mesh Network"
          value={`${telemetry.signalStrength}%`}
          subtitle={`${telemetry.latency}ms latency`}
          icon={Wifi}
          variant="blue"
        />
        <KpiCard
          title="Personnel"
          value={persons.length}
          subtitle={persons.length > 0 ? "PRSN-01 Located" : "Scanning..."}
          icon={Users}
          variant={persons.length > 0 ? "red" : "blue"}
          badge={persons.length > 0 ? "Tracked" : undefined}
        />
        <KpiCard
          title="Active Hazards"
          value={hazards.length}
          subtitle={hazards.length > 0 ? "CH4 + Rock Delam" : "Nominal (0)"}
          icon={AlertTriangle}
          variant={hazards.length > 0 ? "amber" : "green"}
          badge={hazards.length > 0 ? "Active" : undefined}
        />
        <KpiCard
          title="Structural Risk"
          value={structuralAnalysis.assessment}
          subtitle={`${structuralAnalysis.currentDisplacementMm.toFixed(1)}mm shear`}
          icon={Activity}
          variant={isStructuralHigh ? "red" : "green"}
        />
      </div>

      {/* Main Grid: Left Tactical Map & Right Sidepanels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Tactical Map (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col h-[520px] shadow-subtle">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                    Subsurface SLAM Cartography
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    2D/3D LiDAR point cloud registration and drift corridors
                  </p>
                </div>
              </div>
              <Link
                href="/tactical-map"
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Full Map</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden">
              <TacticalMineMap compact={false} />
            </div>
          </div>

          {/* Gas Monitors */}
          <GasGauge />
        </div>

        {/* Right Telemetry & Safe Path Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <PowerTelemetry />
          <SafePathCard />
          <RecentEvents />
        </div>
      </div>
    </div>
  );
}
