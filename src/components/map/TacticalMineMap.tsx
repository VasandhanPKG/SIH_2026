"use client";

import React, { useState, useEffect } from "react";
import { useMission } from "@/context/MissionContext";
import { MINE_JUNCTIONS, MINE_TUNNELS } from "@/lib/mineMapData";
import { MapLayerControls } from "./MapLayerControls";
import { MapLegend } from "./MapLegend";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Flame,
  User,
  Radio,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

interface TacticalMineMapProps {
  compact?: boolean;
  className?: string;
}

export const TacticalMineMap: React.FC<TacticalMineMapProps> = ({ compact = false, className = "" }) => {
  const {
    telemetry,
    hazards,
    persons,
    routes,
    meshNodes,
    layers,
    selectedEntity,
    selectEntity,
    currentStage,
  } = useMission();

  // Pan & Zoom State
  const [zoom, setZoom] = useState<number>(compact ? 0.95 : 1.15);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: compact ? -30 : 20, y: compact ? -10 : 20 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Rover Breadcrumbs
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    if (telemetry.position) {
      setBreadcrumbs((prev) => {
        const last = prev[prev.length - 1];
        if (!last || Math.hypot(last.x - telemetry.position.x, last.y - telemetry.position.y) > 15) {
          return [...prev.slice(-30), { x: telemetry.position.x, y: telemetry.position.y }];
        }
        return prev;
      });
    }
  }, [telemetry.position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const centerOnRover = () => {
    const targetX = 500 - telemetry.position.x * zoom;
    const targetY = 350 - telemetry.position.y * zoom;
    setPan({ x: targetX, y: targetY });
  };

  const resetView = () => {
    setZoom(compact ? 0.95 : 1.15);
    setPan({ x: compact ? -30 : 20, y: compact ? -10 : 20 });
  };

  // Convert tunnel points array to SVG path
  const getTunnelPath = (points: Array<{ x: number; y: number }>) => {
    if (!points.length) return "";
    return points.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), "");
  };

  const explorationPct = telemetry.exploredAreaPct;

  return (
    <div
      className={`relative w-full h-full min-h-[420px] bg-[#0c1e36] overflow-hidden select-none border border-slate-200 rounded-lg shadow-inner ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Tactical Map Grid Background */}
      {layers.grid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1e3a5f 1px, transparent 1px),
              linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {/* Crosshair Compass Center Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[11px] bg-white/95 text-slate-800 px-3 py-1.5 rounded-md border border-slate-200 shadow-md">
        <span className="text-blue-700 font-bold">SLAM MAP:</span>
        <span className="font-semibold">SECTOR 7B SUB-LEVEL</span>
        <span className="text-slate-300">|</span>
        <span className="text-amber-600 font-bold">{explorationPct}% EXPLORED</span>
      </div>

      {/* Floating Zoom & Pan Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
        <div className="flex flex-col bg-white/95 border border-slate-200 p-1 rounded-md shadow-md backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={centerOnRover}
            className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
            title="Focus Rover"
          >
            <Navigation className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
            title="Reset View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Layer Toggles & Legend if not compact */}
      {!compact && (
        <>
          <div className="hidden md:block">
            <MapLayerControls />
          </div>
          <MapLegend />
        </>
      )}

      {/* Main SVG Tactical Map Canvas */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 700"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        <defs>
          {/* Radial Gradient for Rover Sensor Sweep */}
          <radialGradient id="roverGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Radial Hazard Cloud */}
          <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          {/* Survivor Pulse */}
          <radialGradient id="survivorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          {/* Route Arrow Marker */}
          <marker
            id="safeArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>

        {/* 1. TUNNELS LAYER */}
        {layers.tunnels && (
          <g id="tunnels-layer">
            {MINE_TUNNELS.map((tunnel) => {
              const pathD = getTunnelPath(tunnel.points);
              const isHazardous = tunnel.status === "HAZARDOUS";

              return (
                <g key={tunnel.id} className="group">
                  {/* Tunnel Outer Rock Wall */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="32"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Tunnel Excavation Drift Floor */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isHazardous ? "#3b171e" : "#0a192f"}
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Centerline Guide */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isHazardous ? "#991b1b" : "#2563eb"}
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 2. SLAM POINT CLOUD LAYER */}
        {layers.slamCloud && (
          <g id="slam-points" opacity="0.8">
            {MINE_TUNNELS.map((tunnel, tIdx) => {
              const dots = [];
              for (let i = 0; i < 8; i++) {
                const p1 = tunnel.points[0];
                const p2 = tunnel.points[tunnel.points.length - 1];
                const px = p1.x + (p2.x - p1.x) * (i / 8) + (Math.sin(i * 1.7 + tIdx) * 8);
                const py = p1.y + (p2.y - p1.y) * (i / 8) + (Math.cos(i * 2.1 + tIdx) * 8);
                dots.push(
                  <circle
                    key={`slam-${tunnel.id}-${i}`}
                    cx={px}
                    cy={py}
                    r="1.5"
                    fill="#38bdf8"
                    className="animate-pulse"
                  />
                );
              }
              return dots;
            })}
          </g>
        )}

        {/* 3. JUNCTIONS & CHAMBERS LAYER */}
        {layers.infrastructure && (
          <g id="junctions-layer">
            {MINE_JUNCTIONS.map((junc) => {
              const isBase = junc.type === "SHAFT_ENTRY";
              const isRefuge = junc.type === "REFUGE_STATION";
              const isHazard = junc.type === "COLLAPSE_ZONE";

              return (
                <g
                  key={junc.id}
                  transform={`translate(${junc.x}, ${junc.y})`}
                  className="cursor-pointer"
                  onClick={() => selectEntity("NODE", junc.id)}
                >
                  {/* Junction Chamber Ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isBase ? 20 : isRefuge ? 18 : 12}
                    fill={isBase ? "#1e40af" : isRefuge ? "#7f1d1d" : isHazard ? "#78350f" : "#1e293b"}
                    stroke={isBase ? "#60a5fa" : isRefuge ? "#f87171" : isHazard ? "#fbbf24" : "#94a3b8"}
                    strokeWidth="2"
                  />

                  {/* Junction Center Marker */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isBase ? 6 : 4}
                    fill={isBase ? "#ffffff" : isRefuge ? "#f87171" : isHazard ? "#fbbf24" : "#cbd5e1"}
                  />

                  {/* Label */}
                  <text
                    x="0"
                    y={isBase ? 32 : 24}
                    fill="#e2e8f0"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none font-bold"
                  >
                    {junc.label}
                  </text>
                  <text
                    x="0"
                    y={isBase ? 42 : 33}
                    fill="#93c5fd"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {junc.depthMeters}m
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 4. SAFE PATH ROUTES LAYER (ROUTE A vs ROUTE B) */}
        {layers.safeRoute && routes.length > 0 && (
          <g id="ai-routes-layer">
            {routes.map((route) => {
              const isSafe = route.riskLevel === "SAFE";
              const pathD = route.pathNodes.reduce(
                (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
                ""
              );

              return (
                <g key={route.id}>
                  {/* Route Glow Aura */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSafe ? "#10b981" : "#ef4444"}
                    strokeWidth={isSafe ? "6" : "3"}
                    strokeOpacity={isSafe ? "0.4" : "0.3"}
                    strokeLinecap="round"
                  />
                  {/* Route Animated Path Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSafe ? "#10b981" : "#ef4444"}
                    strokeWidth={isSafe ? "3" : "2"}
                    strokeDasharray={isSafe ? "8 6" : "4 4"}
                    strokeLinecap="round"
                    markerEnd={isSafe ? "url(#safeArrow)" : undefined}
                    className={isSafe ? "animate-pulse" : ""}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 5. MESH COMMUNICATION RELAYS LAYER */}
        {layers.communicationNodes && (
          <g id="mesh-nodes-layer">
            {meshNodes.map((node) => (
              <g
                key={node.id}
                transform={`translate(${node.location.x}, ${node.location.y})`}
                className="cursor-pointer"
                onClick={() => selectEntity("NODE", node.id)}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="none"
                  stroke={node.status === "ONLINE" ? "#38bdf8" : "#f59e0b"}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.5"
                  className="animate-spin"
                  style={{ animationDuration: "12s" }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="5"
                  fill="#0c1e36"
                  stroke={node.status === "ONLINE" ? "#38bdf8" : "#f59e0b"}
                  strokeWidth="1.5"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="2"
                  fill={node.status === "ONLINE" ? "#7dd3fc" : "#fbbf24"}
                />
              </g>
            ))}
          </g>
        )}

        {/* 6. HAZARDS LAYER */}
        {layers.hazards && (
          <g id="hazards-layer">
            {hazards.map((haz) => (
              <g
                key={haz.id}
                transform={`translate(${haz.location.x}, ${haz.location.y})`}
                className="cursor-pointer"
                onClick={() => selectEntity("HAZARD", haz.id)}
              >
                <circle cx="0" cy="0" r="36" fill="url(#hazardGlow)" />
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="#78350f"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  className="animate-ping-slow"
                />
                <circle cx="0" cy="0" r="10" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
                <text
                  x="0"
                  y="3"
                  fill="#ffffff"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  !
                </text>
                <text
                  x="0"
                  y="-18"
                  fill="#fef08a"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {haz.valueDisplay}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 7. PERSONNEL / SURVIVOR LAYER */}
        {layers.personnel && (
          <g id="personnel-layer">
            {persons.map((prsn) => (
              <g
                key={prsn.id}
                transform={`translate(${prsn.location.x}, ${prsn.location.y})`}
                className="cursor-pointer"
                onClick={() => selectEntity("PERSON", prsn.id)}
              >
                <circle cx="0" cy="0" r="32" fill="url(#survivorGlow)" />
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="#991b1b"
                  stroke="#f87171"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <circle cx="0" cy="0" r="6" fill="#ffffff" />
                <g transform="translate(0, -22)">
                  <rect
                    x="-32"
                    y="-12"
                    width="64"
                    height="14"
                    fill="#1e1b4b"
                    stroke="#ef4444"
                    strokeWidth="1"
                    rx="2"
                  />
                  <text
                    x="0"
                    y="-2"
                    fill="#ffffff"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    PRSN-01 ({prsn.confidence}%)
                  </text>
                </g>
              </g>
            ))}
          </g>
        )}

        {/* 8. ROVER BREADCRUMBS */}
        {breadcrumbs.length > 1 && (
          <g id="rover-breadcrumbs">
            {breadcrumbs.map((pt, idx) => (
              <circle
                key={`crumb-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r="1.5"
                fill="#38bdf8"
                opacity={(idx + 1) / breadcrumbs.length * 0.8}
              />
            ))}
          </g>
        )}

        {/* 9. ROVER 01 LIVE POSITION & SENSOR RADAR */}
        {telemetry.position && (
          <g
            id="rover-01-marker"
            transform={`translate(${telemetry.position.x}, ${telemetry.position.y})`}
            className="cursor-pointer"
            onClick={() => selectEntity("ROVER", telemetry.roverId)}
          >
            <circle cx="0" cy="0" r="54" fill="url(#roverGlow)" />

            <circle
              cx="0"
              cy="0"
              r="22"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="animate-spin"
              style={{ animationDuration: "6s" }}
            />

            <g transform={`rotate(${telemetry.headingDeg})`}>
              <polygon
                points="0,-12 8,8 0,4 -8,8"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <line
                x1="0"
                y1="-12"
                x2="0"
                y2="-38"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.9"
              />
            </g>

            <g transform="translate(0, 24)">
              <rect
                x="-36"
                y="-10"
                width="72"
                height="15"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
                rx="2"
              />
              <text
                x="0"
                y="1"
                fill="#38bdf8"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ROVER 01 • {telemetry.speed.toFixed(1)}m/s
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Selected Entity Inspector Floating Panel */}
      {selectedEntity.type && (
        <div className="absolute bottom-4 right-4 z-30 w-72 bg-white/95 border border-blue-300 p-3.5 rounded-lg backdrop-blur-md font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2.5">
            <span className="text-blue-700 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-blue-600" />
              {selectedEntity.type === "ROVER"
                ? "ROVER 01 TELEMETRY"
                : selectedEntity.type === "HAZARD"
                ? "HAZARD DOSSIER"
                : selectedEntity.type === "PERSON"
                ? "SURVIVOR DATA"
                : "MINE INFRASTRUCTURE"}
            </span>
            <button
              onClick={() => selectEntity(null, null)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {selectedEntity.type === "ROVER" && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS:</span>
                <span className="text-emerald-700 font-bold">{telemetry.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">POSITION:</span>
                <span className="text-slate-900 font-bold">
                  X:{telemetry.position.x.toFixed(0)} Y:{telemetry.position.y.toFixed(0)} ({telemetry.position.sector})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DEPTH:</span>
                <span className="text-blue-700 font-bold">{telemetry.depthMeters} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BATTERY / TEMP:</span>
                <span className="text-slate-800 font-medium">
                  {telemetry.battery.toFixed(1)}% | {telemetry.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">LIDAR REFRESH:</span>
                <span className="text-blue-700 font-semibold">{telemetry.lidarRateHz} Hz (120k pts)</span>
              </div>
            </div>
          )}

          {selectedEntity.type === "HAZARD" && hazards[0] && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">TYPE:</span>
                <span className="text-amber-700 font-bold">{hazards[0].type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">READING:</span>
                <span className="text-red-700 font-bold">{hazards[0].valueDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CONFIDENCE:</span>
                <span className="text-slate-800 font-bold">{hazards[0].confidence}%</span>
              </div>
              <p className="text-[10px] text-slate-600 pt-1 border-t border-slate-200">
                Action: {hazards[0].recommendedAction}
              </p>
            </div>
          )}

          {selectedEntity.type === "PERSON" && persons[0] && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">CALLSIGN:</span>
                <span className="text-blue-700 font-bold">{persons[0].callsign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI CONFIDENCE:</span>
                <span className="text-emerald-700 font-bold">{persons[0].confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BODY TEMP:</span>
                <span className="text-amber-700 font-bold">{persons[0].thermalTempC ?? 37.2}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DISTANCE:</span>
                <span className="text-slate-900 font-bold">{persons[0].distanceMeters}m from Rover</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
