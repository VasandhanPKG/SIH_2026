"use client";

import React from "react";
import { Shield, Flame, User, Radio, Navigation } from "lucide-react";

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 z-20 bg-white/95 border border-slate-200 px-3.5 py-2 rounded-lg backdrop-blur-md font-mono text-[10px] shadow-md flex items-center gap-4 text-slate-700">
      <div className="flex items-center gap-1.5 font-semibold">
        <span className="flex h-3.5 w-3.5 items-center justify-center bg-blue-100 border border-blue-500 text-blue-600 rounded">
          <Navigation className="h-2 w-2" />
        </span>
        <span>ROVER 01</span>
      </div>

      <div className="flex items-center gap-1.5 font-semibold">
        <span className="flex h-3.5 w-3.5 items-center justify-center bg-amber-100 border border-amber-500 text-amber-600 rounded">
          <Flame className="h-2 w-2" />
        </span>
        <span>GAS / CRACK HAZARD</span>
      </div>

      <div className="flex items-center gap-1.5 font-semibold">
        <span className="flex h-3.5 w-3.5 items-center justify-center bg-red-100 border border-red-500 text-red-600 rounded animate-pulse">
          <User className="h-2 w-2" />
        </span>
        <span>SURVIVOR (PRSN-01)</span>
      </div>

      <div className="flex items-center gap-1.5 font-semibold">
        <span className="flex h-3.5 w-3.5 items-center justify-center bg-sky-100 border border-sky-500 text-sky-600 rounded">
          <Radio className="h-2 w-2" />
        </span>
        <span>MESH RELAY</span>
      </div>

      <div className="flex items-center gap-1.5 font-semibold">
        <span className="h-1.5 w-4 bg-emerald-500 inline-block rounded-full shadow-sm" />
        <span className="text-emerald-700">ROUTE B (SAFE)</span>
      </div>

      <div className="flex items-center gap-1.5 font-semibold">
        <span className="h-1.5 w-4 border-b-2 border-dashed border-red-500 inline-block" />
        <span className="text-red-700">ROUTE A (LETHAL)</span>
      </div>
    </div>
  );
};
