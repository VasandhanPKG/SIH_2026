"use client";

import React, { useEffect } from "react";
import { ShieldCheck, Trophy, RotateCcw, X, CheckCircle2 } from "lucide-react";
import { useMission } from "@/context/MissionContext";

interface MissionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionSummaryModal: React.FC<MissionSummaryModalProps> = ({ isOpen, onClose }) => {
  const { restartDemo } = useMission();

  useEffect(() => {
    if (isOpen) {
      import("canvas-confetti")
        .then((confettiModule) => {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#2563eb", "#10b981", "#f59e0b"],
          });
        })
        .catch(() => {
          // ignore if unavailable
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl border border-slate-200/90 bg-white rounded-2xl p-6 shadow-2xl font-sans">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Mission Objective Completed
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Success
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Autonomous Underground Mine Rescue Operation • Sector 7B
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Key Mission Highlights */}
        <div className="my-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
              <span className="text-slate-400 text-[11px] block font-medium">Survivors</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">1 Located</span>
            </div>
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
              <span className="text-slate-400 text-[11px] block font-medium">SLAM Mapping</span>
              <span className="text-xl font-bold font-mono text-blue-700 mt-0.5 block">100% Complete</span>
            </div>
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
              <span className="text-slate-400 text-[11px] block font-medium">Hazards Isolated</span>
              <span className="text-xl font-bold font-mono text-amber-700 mt-0.5 block">2 Neutralized</span>
            </div>
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
              <span className="text-slate-400 text-[11px] block font-medium">Escape Route</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">Route B</span>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-4 space-y-2.5 text-slate-700">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Operational Performance Dossier</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Autonomous Ingress:</strong> Rover 01 traversed 640m through deep shaft without packet loss.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Gas & Strata Detection:</strong> Lethal 2.4% CH4 pocket flagged in Tunnel B-04, preventing human casualty.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Thermal Human Tracking:</strong> PRSN-01 identified with 95% AI confidence in Refuge Chamber 7B.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Optimal Route Synthesis:</strong> Route B bypassed all hazards; Rescue Brigade dispatched successfully.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
          <button
            onClick={() => {
              onClose();
              restartDemo();
            }}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 font-semibold transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Replay Mission</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
