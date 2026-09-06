"use client";

import React from "react";
import { Layers, Eye, EyeOff } from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { MapLayerState } from "@/types/map";

export const MapLayerControls: React.FC = () => {
  const { layers, toggleLayer } = useMission();

  const layerItems: Array<{ key: keyof MapLayerState; label: string; color: string }> = [
    { key: "tunnels", label: "Tunnels & Sectors", color: "text-slate-700" },
    { key: "slamCloud", label: "LiDAR / SLAM Mesh", color: "text-blue-600" },
    { key: "hazards", label: "Hazards (CH4/Crack)", color: "text-amber-600" },
    { key: "personnel", label: "Personnel / Survivors", color: "text-red-600" },
    { key: "communicationNodes", label: "Mesh Relays", color: "text-sky-600" },
    { key: "safeRoute", label: "AI Safe Routes", color: "text-emerald-600" },
    { key: "grid", label: "Tactical Grid", color: "text-slate-400" },
  ];

  return (
    <div className="absolute top-4 right-4 z-20 bg-white/95 border border-slate-200 p-3 rounded-lg backdrop-blur-md font-mono text-xs shadow-lg min-w-[200px]">
      <div className="flex items-center gap-1.5 text-slate-800 font-bold border-b border-slate-200 pb-2 mb-2">
        <Layers className="h-3.5 w-3.5 text-blue-600" />
        <span className="tracking-wider uppercase text-[11px]">Map Layers</span>
      </div>

      <div className="space-y-1">
        {layerItems.map((item) => {
          const isEnabled = layers[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-all border ${
                isEnabled
                  ? "bg-blue-50/70 border-blue-200 text-slate-800 font-semibold"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className={`text-[11px] flex items-center gap-1.5 ${item.color}`}>
                <span
                  className={`h-2 w-2 rounded-none border ${
                    isEnabled ? "bg-current border-current" : "border-slate-400 bg-transparent"
                  }`}
                />
                {item.label}
              </span>
              {isEnabled ? (
                <Eye className="h-3 w-3 text-blue-600" />
              ) : (
                <EyeOff className="h-3 w-3 text-slate-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
