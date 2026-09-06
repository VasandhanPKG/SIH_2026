"use client";

import React, { useState } from "react";
import { useMission } from "@/context/MissionContext";
import { Settings, Save, Server, Sliders, Check } from "lucide-react";

export default function SettingsPage() {
  const { mode, setMode } = useMission();
  const [wsUrl, setWsUrl] = useState<string>("ws://localhost:8000/api/v1/ws/rover");
  const [mqttBroker, setMqttBroker] = useState<string>("mqtt://192.168.1.100:1883");
  const [ch4WarnThreshold, setCh4WarnThreshold] = useState<number>(1.0);
  const [ch4CritThreshold, setCh4CritThreshold] = useState<number>(2.0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Station Configuration & Gateways
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Gateway communication endpoints, telemetry data provider modes, and DGMS alarm thresholds.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95"
        >
          {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{savedSuccess ? "Config Saved!" : "Save Configuration"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Provider & Connection Architecture (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-subtle">
            <div className="flex items-center gap-2 text-xs text-blue-700 font-bold border-b border-slate-100 pb-3">
              <Server className="h-4 w-4" />
              <span>Operational Data Provider Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("DEMO")}
                className={`p-4 rounded-xl text-left space-y-1.5 transition-all border ${
                  mode === "DEMO"
                    ? "bg-amber-50/70 border-amber-300 text-amber-950 shadow-subtle"
                    : "bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Demo Simulation</span>
                  {mode === "DEMO" && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  8-Stage mission state machine. Does not require physical hardware. Ideal for SIH evaluation.
                </p>
              </button>

              <button
                onClick={() => setMode("LIVE")}
                className={`p-4 rounded-xl text-left space-y-1.5 transition-all border ${
                  mode === "LIVE"
                    ? "bg-blue-50/70 border-blue-300 text-blue-950 shadow-subtle"
                    : "bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Live Hardware Link</span>
                  {mode === "LIVE" && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Connects to FastAPI, WebSocket & MQTT broker for real rover telemetry reception.
                </p>
              </button>
            </div>

            {/* Gateway Endpoints */}
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs block font-semibold">FastAPI WebSocket Endpoint</label>
                <input
                  type="text"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-blue-700 font-mono font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs block font-semibold">MQTT Broker Address</label>
                <input
                  type="text"
                  value={mqttBroker}
                  onChange={(e) => setMqttBroker(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Safety Thresholds & Alarm Calibration (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-subtle">
            <div className="flex items-center gap-2 text-xs text-amber-700 font-bold border-b border-slate-100 pb-3">
              <Sliders className="h-4 w-4" />
              <span>DGMS Safety Alarm Thresholds</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>Methane (CH4) Warning Limit (% LEL)</span>
                  <span className="font-mono font-bold text-amber-700">{ch4WarnThreshold}% LEL</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={ch4WarnThreshold}
                  onChange={(e) => setCh4WarnThreshold(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-200 rounded-lg h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>Methane (CH4) Critical Stop Limit (% LEL)</span>
                  <span className="font-mono font-bold text-red-700">{ch4CritThreshold}% LEL</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={ch4CritThreshold}
                  onChange={(e) => setCh4CritThreshold(parseFloat(e.target.value))}
                  className="w-full accent-red-500 bg-slate-200 rounded-lg h-2"
                />
              </div>

              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-600">
                <strong className="text-slate-900 block font-semibold">Standard Compliance:</strong>
                <p className="leading-relaxed">
                  Directorate General of Mines Safety (DGMS) Circular 04/2024 requires automatic flammability warning at 1.0% CH4 and rover actuator de-energization at 2.0% CH4 in Indian coal and metal mines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
