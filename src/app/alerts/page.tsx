"use client";

import React, { useState } from "react";
import { useMission } from "@/context/MissionContext";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Filter } from "lucide-react";
import { SeverityLevel } from "@/types/mission";

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, resolveAlert } = useMission();
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | "ALL">("ALL");

  const filteredAlerts = alerts.filter((a) =>
    filterSeverity === "ALL" ? true : a.category === filterSeverity
  );

  const getCategoryStyles = (category: SeverityLevel) => {
    switch (category) {
      case "CRITICAL":
        return {
          border: "border-red-200",
          bg: "bg-red-50/50",
          badge: "bg-red-600 text-white",
          icon: <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />,
        };
      case "WARNING":
        return {
          border: "border-amber-200",
          bg: "bg-amber-50/50",
          badge: "bg-amber-500 text-slate-950 font-bold",
          icon: <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />,
        };
      default:
        return {
          border: "border-slate-200",
          bg: "bg-slate-50/50",
          badge: "bg-blue-600 text-white",
          icon: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
        };
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Incident & Safety Alerts Command
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Live hazard event queue, telemetry alarm thresholds, and recommended containment actions.
            </p>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
          {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 font-semibold transition-all rounded-lg ${
                filterSeverity === sev
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-slate-400 text-xs shadow-subtle">
            No incidents found matching active filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const style = getCategoryStyles(alert.category);

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl transition-all border ${style.border} ${style.bg} ${
                  !alert.acknowledged ? "shadow-subtle" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    {style.icon}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                          {alert.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {alert.sector} • {alert.location} • Target: {alert.roverId}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-mono self-start">
                    {alert.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3 pl-8">
                  {alert.message}
                </p>

                <div className="bg-white border border-slate-200/80 rounded-xl p-3 ml-8 mb-3 text-xs flex items-start gap-2">
                  <strong className="text-amber-700 shrink-0 font-semibold">Recommended Action:</strong>
                  <span className="text-slate-700 font-medium">{alert.recommendedAction}</span>
                </div>

                <div className="flex items-center justify-between pl-8 border-t border-slate-200/60 pt-3 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {alert.id} {alert.confidence ? `• Confidence: ${alert.confidence}%` : ""}
                  </span>

                  <div className="flex items-center gap-2">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Acknowledged
                      </span>
                    )}

                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        Resolve Alert
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
