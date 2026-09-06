"use client";

import React from "react";
import { ShieldAlert, X } from "lucide-react";
import { useMission } from "@/context/MissionContext";

interface EmergencyStopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyStopModal: React.FC<EmergencyStopModalProps> = ({ isOpen, onClose }) => {
  const { triggerEmergencyStop, resumeFromEmergencyStop, isEmergencyStopped, telemetry } = useMission();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg border border-slate-200/90 bg-white rounded-2xl p-6 shadow-2xl font-sans">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-red-50 text-red-600 rounded-xl">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEmergencyStopped ? "Emergency Lockdown Active" : "Emergency Actuator Stop"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">Target: {telemetry.name} ({telemetry.roverId})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-4 text-xs text-slate-600">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Sector Location:</span>
              <span className="text-slate-900 font-bold">{telemetry.position.sector} ({telemetry.position.tunnelId})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Speed:</span>
              <span className="text-red-700 font-bold">{telemetry.speed.toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Motor Draw:</span>
              <span className="text-slate-900 font-bold">{telemetry.motorCurrent} A</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isEmergencyStopped
              ? "Actuators are currently de-energized. Drive power is disengaged. Multi-gas pellistors and thermal FLIR sensors remain active in monitoring guard mode."
              : "Warning: Engaging Emergency Stop will immediately cut power to drive motors, lock electromagnetic brakes, and abort autonomous navigation pathways."}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Cancel
          </button>
          {isEmergencyStopped ? (
            <button
              type="button"
              onClick={() => {
                resumeFromEmergencyStop();
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95"
            >
              Resume Operation
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerEmergencyStop();
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm shadow-red-500/20 active:scale-95"
            >
              Confirm Emergency Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
