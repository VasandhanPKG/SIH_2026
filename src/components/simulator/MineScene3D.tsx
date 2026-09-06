"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Rover3DModel } from "./RoverModel";
import { UndergroundMineEnvironment } from "./UndergroundMineEnvironment";
import { Worker3DModel } from "./WorkerModel";
import { HazardVisuals } from "./HazardVisuals";
import { SafeRouteVisuals } from "./SafeRouteVisuals";
import { SignalPulses } from "./SignalPulses";
import { MissionPhaseKey, SimulatorWaypoint } from "@/lib/simulatorConfig";

export type CameraViewMode = "CHASE_CAM" | "ROVER_POV" | "TACTICAL_ORBIT" | "TOP_DOWN";

interface MineScene3DProps {
  phase: MissionPhaseKey;
  progressPct: number;
  currentWaypoint: SimulatorWaypoint;
  cameraMode: CameraViewMode;
  onCameraModeChange: (mode: CameraViewMode) => void;
}

export const MineScene3D: React.FC<MineScene3DProps> = ({
  phase,
  progressPct,
  currentWaypoint,
  cameraMode,
  onCameraModeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const roverRef = useRef<Rover3DModel | null>(null);
  const envRef = useRef<UndergroundMineEnvironment | null>(null);
  const workerRef = useRef<Worker3DModel | null>(null);
  const hazardRef = useRef<HazardVisuals | null>(null);
  const safeRouteRef = useRef<SafeRouteVisuals | null>(null);
  const signalRef = useRef<SignalPulses | null>(null);

  // Mouse interaction state for manual orbit/pan
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const orbitAnglesRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3.8, distance: 36 });
  const isOrbitManualRef = useRef(false);

  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene & Deep Underground Void Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // Deep subterranean coal dark void
    scene.fog = new THREE.FogExp2(0x060913, 0.02);
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 200);
    camera.position.set(-35, 14, 25);
    cameraRef.current = camera;

    // 3. Renderer with high performance & shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ambient & Subterranean Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0a0f1d, 0.7);
    scene.add(hemiLight);

    // 5. Build Procedural Sub-components
    const env = new UndergroundMineEnvironment();
    scene.add(env.group);
    envRef.current = env;

    const rover = new Rover3DModel();
    rover.group.position.set(currentWaypoint.x, currentWaypoint.y, currentWaypoint.z);
    scene.add(rover.group);
    roverRef.current = rover;

    const worker = new Worker3DModel();
    scene.add(worker.group);
    workerRef.current = worker;

    const hazard = new HazardVisuals();
    scene.add(hazard.group);
    hazardRef.current = hazard;

    const safeRoute = new SafeRouteVisuals();
    scene.add(safeRoute.group);
    safeRouteRef.current = safeRoute;

    const signals = new SignalPulses();
    scene.add(signals.group);
    signalRef.current = signals;

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Mouse Drag Controls for Orbit
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      isOrbitManualRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      orbitAnglesRef.current.theta -= deltaX * 0.008;
      orbitAnglesRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.1, orbitAnglesRef.current.phi - deltaY * 0.008));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitAnglesRef.current.distance = Math.max(12, Math.min(65, orbitAnglesRef.current.distance + e.deltaY * 0.04));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    // 6. Main Render Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaSec = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      if (envRef.current) envRef.current.update(deltaSec);

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("wheel", handleWheel);

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update Rover, Hazards, Worker, and Camera based on Mission Phase & Waypoint
  useEffect(() => {
    const rover = roverRef.current;
    const worker = workerRef.current;
    const hazard = hazardRef.current;
    const safeRoute = safeRouteRef.current;
    const signals = signalRef.current;
    const camera = cameraRef.current;

    if (!rover || !camera) return;

    // 1. Smoothly Lerp Rover Position & Heading
    const targetPos = new THREE.Vector3(currentWaypoint.x, currentWaypoint.y, currentWaypoint.z);
    rover.group.position.lerp(targetPos, 0.25);

    // Convert heading degrees to radians (Three.js yaw)
    const targetYaw = -(currentWaypoint.headingDeg - 90) * (Math.PI / 180);
    rover.group.rotation.y = THREE.MathUtils.lerp(rover.group.rotation.y, targetYaw, 0.2);

    // 2. Update Sub-components
    const isScanning = phase === "DETECT";
    const hazardState =
      currentWaypoint.gasCh4 >= 2.0
        ? "CRITICAL"
        : currentWaypoint.gasCh4 >= 0.8
        ? "WARNING"
        : "SAFE";

    rover.update(0.016, currentWaypoint.speed, isScanning, hazardState);

    if (worker) {
      worker.update(phase === "DETECT" || phase === "ANALYSE" || phase === "CONNECT" || phase === "COMPLETE");
    }

    if (hazard) {
      hazard.update(0.016, phase === "MONITOR" || phase === "DETECT" || phase === "ANALYSE" || phase === "CONNECT" || phase === "COMPLETE");
    }

    if (safeRoute) {
      const isRouteB = phase === "ANALYSE" || phase === "CONNECT" || phase === "COMPLETE";
      const isRouteA = phase === "ANALYSE";
      safeRoute.update(isRouteB, isRouteA);
    }

    if (signals) {
      signals.update(0.016, rover.group.position, phase === "CONNECT" || phase === "COMPLETE");
    }

    // 3. Dynamic Camera View Modes
    const rPos = rover.group.position;
    const rRot = rover.group.rotation.y;

    if (cameraMode === "ROVER_POV") {
      // Front bumper camera view looking forward
      const camOffset = new THREE.Vector3(1.5, 1.1, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rRot);
      const lookOffset = new THREE.Vector3(12.0, 0.6, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rRot);
      camera.position.lerp(rPos.clone().add(camOffset), 0.18);
      camera.lookAt(rPos.clone().add(lookOffset));
    } else if (cameraMode === "CHASE_CAM") {
      // 3rd person trailing camera
      const camOffset = new THREE.Vector3(-8.5, 4.8, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rRot);
      const lookOffset = new THREE.Vector3(6.0, 1.0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rRot);
      camera.position.lerp(rPos.clone().add(camOffset), 0.12);
      camera.lookAt(rPos.clone().add(lookOffset));
    } else if (cameraMode === "TOP_DOWN") {
      // Direct overhead tactical view
      const topTarget = new THREE.Vector3(rPos.x + 4, 38, rPos.z);
      camera.position.lerp(topTarget, 0.1);
      camera.lookAt(rPos.x + 4, 0, rPos.z);
    } else {
      // TACTICAL_ORBIT: Spherical orbit coordinates around the rover
      const theta = orbitAnglesRef.current.theta;
      const phi = orbitAnglesRef.current.phi;
      const dist = orbitAnglesRef.current.distance;

      const camX = rPos.x + dist * Math.sin(phi) * Math.cos(theta);
      const camY = Math.max(3.0, dist * Math.cos(phi));
      const camZ = rPos.z + dist * Math.sin(phi) * Math.sin(theta);

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.15);
      camera.lookAt(rPos.x, rPos.y + 1.2, rPos.z);
    }
  }, [phase, progressPct, currentWaypoint, cameraMode]);

  const resetCamera = useCallback(() => {
    orbitAnglesRef.current = { theta: Math.PI / 4, phi: Math.PI / 3.8, distance: 36 };
    isOrbitManualRef.current = false;
  }, []);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full min-h-[460px] bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white rounded-2xl border border-slate-700">
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4 text-amber-400">
          ⚠️ 3D WebGL Acceleration Unavailable
        </div>
        <p className="text-sm text-slate-300 max-w-md">
          Your browser is currently running in a software-rendered mode. The mission simulation telemetry and 2D radar below remain fully active.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[480px] select-none overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-[480px] cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Scene HUD Badges */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold text-white tracking-wider font-mono">
            UNDERGROUND MINE 3D • SECTOR 7B
          </span>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300">
          DEPTH: -740m • DIGITAL TWIN
        </div>
      </div>

      {/* 3D Camera Controls Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg z-10">
        <button
          onClick={() => onCameraModeChange("CHASE_CAM")}
          title="3rd Person Follow Camera"
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
            cameraMode === "CHASE_CAM"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          FOLLOW
        </button>
        <button
          onClick={() => onCameraModeChange("ROVER_POV")}
          title="Rover Bumper Optical / FLIR POV"
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
            cameraMode === "ROVER_POV"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          POV
        </button>
        <button
          onClick={() => onCameraModeChange("TACTICAL_ORBIT")}
          title="Free 360° Orbit Inspection"
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
            cameraMode === "TACTICAL_ORBIT"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          ORBIT
        </button>
        <button
          onClick={() => onCameraModeChange("TOP_DOWN")}
          title="Overhead Tactical Map View"
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
            cameraMode === "TOP_DOWN"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          TOP
        </button>
        <button
          onClick={resetCamera}
          title="Reset Camera Position"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition-colors"
        >
          ↺
        </button>
      </div>

      {/* Crosshair overlay in ROVER POV mode */}
      {cameraMode === "ROVER_POV" && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="relative w-28 h-28 border border-cyan-400/40 rounded-full flex items-center justify-center">
            <div className="w-4 h-0.5 bg-cyan-400" />
            <div className="h-4 w-0.5 bg-cyan-400 absolute" />
            <span className="absolute bottom-2 text-[9px] font-mono text-cyan-400 tracking-wider">
              OPTICAL HUD
            </span>
          </div>
        </div>
      )}

      {/* Bottom Floating Status Ticker */}
      <div className="absolute bottom-3 left-4 right-4 pointer-events-none z-10 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold">ROVER STATUS:</span>
          <span className="text-white font-medium">{currentWaypoint.statusText}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>SPEED: <strong className="text-slate-200">{currentWaypoint.speed.toFixed(1)} m/s</strong></span>
          <span>DIST: <strong className="text-slate-200">{currentWaypoint.distanceM.toFixed(1)} m</strong></span>
          <span>MAPPED: <strong className="text-blue-400">{currentWaypoint.mappedPct}%</strong></span>
        </div>
      </div>
    </div>
  );
};
