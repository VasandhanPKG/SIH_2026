"use client";

import React, { useRef, useEffect } from "react";
import { SimulatorWaypoint, MINE_OBJECTS_CONFIG, MissionPhaseKey } from "@/lib/simulatorConfig";
import { Map, Layers } from "lucide-react";

interface SimulatorMinimapProps {
  waypoint: SimulatorWaypoint;
  phase: MissionPhaseKey;
}

export const SimulatorMinimap: React.FC<SimulatorMinimapProps> = ({ waypoint, phase }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#0f172a"; // slate-900 background
    ctx.fillRect(0, 0, width, height);

    // Coordinate mapping helper: 3D X (-35 to +32) -> 2D X (20 to width-20)
    // 3D Z (-12 to +12) -> 2D Y (height-20 to 20)
    const mapX = (x3d: number) => {
      return 30 + ((x3d + 35) / 68) * (width - 60);
    };
    const mapY = (z3d: number) => {
      return height / 2 + (z3d / 24) * (height - 40);
    };

    // 1. Grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Mine Drift Corridors (Tunnel geometry)
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Main Tunnel A
    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(mapX(-34), mapY(0));
    ctx.lineTo(mapX(0), mapY(0));
    ctx.stroke();

    // Hazard Drift B-04
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(14), mapY(-6.5));
    ctx.lineTo(mapX(28), mapY(-7.8));
    ctx.stroke();

    // South Incline Bypass
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(14), mapY(8));
    ctx.lineTo(mapX(28), mapY(-7.8));
    ctx.stroke();

    // 3. Safe Route B (Cyan / Emerald overlay if in ANALYSE or later)
    if (phase === "ANALYSE" || phase === "CONNECT" || phase === "COMPLETE") {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(mapX(-32), mapY(0));
      ctx.lineTo(mapX(0), mapY(0));
      ctx.lineTo(mapX(14), mapY(8));
      ctx.lineTo(mapX(28), mapY(-7.8));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Base Station Marker
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(mapX(-34), mapY(0), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px monospace";
    ctx.fillText("BASE C2", mapX(-34) - 16, mapY(0) - 10);

    // 5. Methane Hazard Zone Marker
    if (phase !== "READY" && phase !== "EXPLORE") {
      ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
      ctx.beginPath();
      ctx.arc(mapX(14), mapY(-6.5), 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(mapX(14), mapY(-6.5), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("CH4 2.4%", mapX(14) - 18, mapY(-6.5) - 10);
    }

    // 6. Trapped Worker Marker
    if (phase === "DETECT" || phase === "ANALYSE" || phase === "CONNECT" || phase === "COMPLETE") {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(mapX(28), mapY(-7.8), 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fca5a5";
      ctx.fillText("PRSN-01 (37.2°C)", mapX(28) - 40, mapY(-7.8) + 16);
    }

    // 7. Live Rover Dot & Heading Beam
    const rX = mapX(waypoint.x);
    const rY = mapY(waypoint.z);

    // Heading field of view cone
    const headingRad = (waypoint.headingDeg - 90) * (Math.PI / 180);
    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.beginPath();
    ctx.moveTo(rX, rY);
    ctx.arc(rX, rY, 22, headingRad - 0.45, headingRad + 0.45);
    ctx.closePath();
    ctx.fill();

    // Rover body dot
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(rX, rY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 9px monospace";
    ctx.fillText("ROVER-01", rX - 22, rY - 10);
  }, [waypoint, phase]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
        <span className="font-bold text-slate-800 flex items-center gap-1.5 font-mono uppercase">
          <Map className="h-3.5 w-3.5 text-blue-600" />
          Synchronized 2D Minimap
        </span>
        <span className="text-[10px] font-mono text-slate-400">SLAM RADAR</span>
      </div>

      <div className="w-full h-[180px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
        <canvas ref={canvasRef} width={380} height={180} className="w-full h-full block" />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-500 pt-1">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Rover</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span>CH4 Hazard</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>Survivor</span>
        </div>
      </div>
    </div>
  );
};
