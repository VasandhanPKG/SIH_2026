"use client";

import React from "react";
import { useMission } from "@/context/MissionContext";
import { Activity, Radio, Cpu, Gauge, CheckCircle2 } from "lucide-react";

export default function DiagnosticsPage() {
  const { telemetry, meshNodes } = useMission();

  const sensorStatuses = [
    { name: "Dual Optical RGB Sensor", status: "ONLINE", refresh: "30 FPS", latency: "14ms" },
    { name: "FLIR Thermal Matrix Sensor", status: "ONLINE", refresh: "25 FPS", latency: "18ms" },
    { name: "3D Velodyne Solid-State LiDAR", status: "ONLINE", refresh: "120 Hz", latency: "8ms" },
    { name: "9-Axis IMU (Gyro + Accel + Mag)", status: "ONLINE", refresh: "400 Hz", latency: "2ms" },
    { name: "Methane (CH4) Pellistor", status: "ONLINE", refresh: "10 Hz", latency: "5ms" },
    { name: "Carbon Monoxide (CO) Sensor", status: "ONLINE", refresh: "10 Hz", latency: "5ms" },
    { name: "Oxygen (O2) Galvanic Cell", status: "ONLINE", refresh: "10 Hz", latency: "5ms" },
    { name: "Ultrasonic Proximity Arrays", status: "ONLINE", refresh: "50 Hz", latency: "10ms" },
  ];

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              System Diagnostics & Health
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Subsurface ad-hoc wireless mesh topology, sensor health status, and onboard edge AI metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3.5 py-1.5 text-xs shadow-subtle font-medium">
          <span className="text-slate-400">Mesh Status:</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected (4 Relays)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mesh Network Repeaters (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Radio className="h-4 w-4 text-blue-600" />
                <span>Ad-Hoc Wireless Mesh Topology</span>
              </span>
              <span className="text-xs text-blue-700 font-semibold font-mono">
                Signal: {telemetry.signalStrength}%
              </span>
            </div>

            <div className="space-y-3">
              {meshNodes.map((node) => {
                const isDegraded = node.status === "DEGRADED";

                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-xl flex items-center justify-between text-xs transition-all border ${
                      isDegraded
                        ? "bg-amber-50/60 border-amber-200/80"
                        : "bg-slate-50/70 border-slate-200/80"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{node.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isDegraded ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {node.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {node.location.label} • Battery: {node.batteryPct}%
                      </span>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-blue-700 font-bold font-mono">{node.signalPct}% Link</div>
                      <div className="text-[10px] text-slate-400 font-mono">{node.latencyMs}ms | {node.packetLossPct}% Loss</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Onboard AI Engine */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span>Onboard Edge AI Accelerator (NVIDIA Jetson Orin)</span>
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                Online
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs text-center">
              <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block font-medium">Inference FPS</span>
                <span className="text-lg font-bold text-blue-700 font-mono">28.4 FPS</span>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block font-medium">Confidence Avg</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">95.2%</span>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block font-medium">Model Architecture</span>
                <span className="text-sm font-semibold text-slate-800 mt-1 block">YOLO-v9 Mine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Array Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-600" />
              <span>Integrated Hardware Sensor Matrix</span>
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              8 / 8 Operational
            </span>
          </div>

          <div className="space-y-2.5">
            {sensorStatuses.map((sensor) => (
              <div
                key={sensor.name}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">{sensor.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Latency: {sensor.latency}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {sensor.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block mt-1">{sensor.refresh}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
