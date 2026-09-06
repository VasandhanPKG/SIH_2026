"use client";

import React from "react";
import { Navigation, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const SafePathCard: React.FC = () => {
  const { routes, dispatchRescueTeam, isRescueDispatched } = useMission();

  if (!routes || routes.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none">
        <div className="flex items-center gap-2 text-slate-800 text-xs font-bold mb-2">
          <Navigation className="h-4 w-4 text-blue-600" />
          <span>AI Rescue Path Planning</span>
        </div>
        <p className="text-xs text-slate-400">
          Awaiting spatial map and survivor coordinate lock to synthesize escape corridors...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Navigation className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            AI Safe Route Planning
          </span>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
          2 Routes Evaluated
        </span>
      </div>

      <div className="space-y-3">
        {routes.map((route) => {
          const isSafe = route.riskLevel === "SAFE";

          return (
            <div
              key={route.id}
              className={`p-4 rounded-xl border transition-all ${
                isSafe
                  ? "bg-emerald-50/50 border-emerald-200 shadow-subtle"
                  : "bg-red-50/40 border-red-200/80 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isSafe ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-xs font-bold ${isSafe ? "text-slate-900" : "text-red-900"}`}>
                    {route.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isSafe
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }`}
                >
                  {isSafe ? "Recommended" : "High Hazard"}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {route.notes}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-lg border border-slate-200/80 text-slate-600">
                <div>Distance: <strong className="font-mono text-slate-900">{route.lengthMeters}m</strong></div>
                <div>Est. Transit: <strong className="font-mono text-blue-700">{route.estimatedTransitTimeMin} min</strong></div>
              </div>

              {isSafe && (
                <button
                  type="button"
                  onClick={dispatchRescueTeam}
                  disabled={isRescueDispatched}
                  className={`mt-3 w-full py-2.5 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm ${
                    isRescueDispatched
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95"
                  }`}
                >
                  {isRescueDispatched ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Rescue Team Dispatched
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Dispatch Rescue Brigade (Route B)
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
