"use client";

import React from "react";
import { useMission } from "@/context/MissionContext";
import { Users, UserCheck, MapPin } from "lucide-react";
import { TacticalMineMap } from "@/components/map/TacticalMineMap";

export default function PersonnelPage() {
  const { persons, selectEntity } = useMission();

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Personnel & Survivor Roster
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Thermal silhouette identification, vital signs estimation, and underground refuge locator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3.5 py-1.5 text-xs shadow-subtle font-medium">
          <span className="text-slate-400">Survivor Status:</span>
          <span className="text-red-700 font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            {persons.length} Located
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personnel Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {persons.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-3 shadow-subtle">
              <Users className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">
                No Registered Survivor Signals in Radius
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Rover 3D LiDAR point cloud scans and FLIR thermal sensor sweeps are actively scanning Sector 7B crosscuts.
              </p>
            </div>
          ) : (
            persons.map((person) => (
              <div
                key={person.id}
                className="bg-white border border-red-200 rounded-2xl p-5 space-y-4 shadow-subtle"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-red-50 text-red-600 rounded-xl">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">{person.id}</h2>
                        <span className="text-xs text-blue-700 font-semibold font-mono">[{person.callsign}]</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Located at {person.location.label}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-full">
                    {person.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-medium">AI Confidence</span>
                    <span className="text-base font-bold text-emerald-700 font-mono">{person.confidence}%</span>
                    <span className="text-[10px] text-slate-400 block">YOLO-v9 Thermal Fusion</span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-medium">Body Temperature</span>
                    <span className="text-base font-bold text-amber-700 font-mono">{person.thermalTempC ?? 37.2}°C</span>
                    <span className="text-[10px] text-emerald-700 block font-medium">Vitals: {person.vitalStatus}</span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-medium">Distance from Rover</span>
                    <span className="text-base font-bold text-blue-700 font-mono">{person.distanceMeters} m</span>
                    <span className="text-[10px] text-slate-400 block">Line-of-Sight</span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-medium">Detection Source</span>
                    <span className="text-sm font-semibold text-slate-800">{person.detectionSource}</span>
                    <span className="text-[10px] text-slate-400 block">Multi-Spectral</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sector 7B Sub-Level</span>
                  <button
                    onClick={() => selectEntity("PERSON", person.id)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    Focus on Map
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Mini Tactical Map View (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col h-[520px] shadow-subtle">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <span className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>Refuge Chamber Geometry</span>
            </span>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full">
              Coordinates Locked
            </span>
          </div>
          <div className="flex-1 w-full relative rounded-xl overflow-hidden">
            <TacticalMineMap compact={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
