"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const RecentEvents: React.FC = () => {
  const { alerts } = useMission();

  const getIcon = (category: string) => {
    switch (category) {
      case "CRITICAL":
        return <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />;
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle select-none space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-sm font-bold text-slate-800 tracking-tight">
          Recent Incident & Mission Log
        </span>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full">
          {alerts.length} Total
        </span>
      </div>

      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-xl text-xs flex items-start gap-3 transition-all border ${
              alert.category === "CRITICAL"
                ? "bg-red-50/60 border-red-200/80 text-red-950"
                : alert.category === "WARNING"
                ? "bg-amber-50/60 border-amber-200/80 text-amber-950"
                : "bg-slate-50/60 border-slate-200/80 text-slate-800"
            }`}
          >
            {getIcon(alert.category)}
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs truncate text-slate-900">{alert.title}</span>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {alert.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
