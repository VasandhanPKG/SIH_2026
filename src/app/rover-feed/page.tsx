"use client";

import React, { useState } from "react";
import { CameraFeed } from "@/components/rover/CameraFeed";
import { DriveControls } from "@/components/rover/DriveControls";
import { PowerTelemetry } from "@/components/rover/PowerTelemetry";
import { EmergencyStopModal } from "@/components/layout/EmergencyStopModal";
import { Video, ShieldAlert } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export default function RoverFeedPage() {
  const { isEmergencyStopped } = useMission();
  const [showEStopModal, setShowEStopModal] = useState<boolean>(false);

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Live Optical & Thermal HUD Feed
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Multi-spectral dual-lens camera stream with real-time HUD and direct actuator control.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEStopModal(true)}
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 rounded-xl transition-all shadow-sm active:scale-95 ${
            isEmergencyStopped
              ? "bg-blue-600 text-white animate-pulse"
              : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{isEmergencyStopped ? "E-Stop Engaged" : "Emergency Stop"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Camera Feed (8 cols) */}
        <div className="lg:col-span-8 h-[540px] rounded-2xl overflow-hidden shadow-subtle">
          <CameraFeed showAiOverlay={true} />
        </div>

        {/* Right Controls & Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <DriveControls />
          <PowerTelemetry />
        </div>
      </div>

      <EmergencyStopModal
        isOpen={showEStopModal}
        onClose={() => setShowEStopModal(false)}
      />
    </div>
  );
}
