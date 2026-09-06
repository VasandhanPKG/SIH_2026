"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, UserCheck, Flame, Radio, RotateCcw, X, Sparkles } from "lucide-react";

interface MissionDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
}

export const MissionDebriefModal: React.FC<MissionDebriefModalProps> = ({ isOpen, onClose, onReplay }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200/80">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Mission Complete
              </span>
              <span className="text-xs text-slate-500 font-mono">SECTOR 7B</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Subsurface Intelligence Assessment Locked
            </h2>
          </div>
        </div>

        {/* Core Judging Statement */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl text-white shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Mission Impact</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            &ldquo;Rescue teams now know where to go and what hazards to bypass — before entering the danger zone.&rdquo;
          </p>
        </div>

        {/* 5 Assessment Pillars Outcome Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-red-500" />
              SURVIVOR STATUS
            </div>
            <div className="font-bold text-slate-800 text-sm">
              PRSN-01 Located (37.2°C)
            </div>
            <div className="text-[11px] text-slate-500">Refuge Chamber 7B (Distance 42m)</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              HAZARDS ISOLATED
            </div>
            <div className="font-bold text-amber-700 text-sm">
              CH4 2.4% + 8.4mm Shear
            </div>
            <div className="text-[11px] text-slate-500">Tunnel B-04 flagged as Lethal</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              EXTRACTION CORRIDOR
            </div>
            <div className="font-bold text-emerald-700 text-sm">
              Route B (100% Safe Bypass)
            </div>
            <div className="text-[11px] text-slate-500">Synthesized avoiding all hazards</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-blue-500" />
              CONTROL UPLINK
            </div>
            <div className="font-bold text-blue-700 text-sm">
              100% Data Transmitted
            </div>
            <div className="text-[11px] text-slate-500">Dossier sent to Brigade Delta</div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close Debrief
          </button>
          <button
            onClick={() => {
              onClose();
              onReplay();
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
