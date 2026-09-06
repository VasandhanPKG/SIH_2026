"use client";

import React, { useState } from "react";
import {
  Cpu,
  Radio,
  Eye,
  Flame,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Shield,
  ArrowRight,
  Navigation,
  Crosshair,
  Sparkles,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";

interface Subsystem {
  id: string;
  name: string;
  category: "VISION" | "SENSORS" | "MOBILITY" | "COMPUTE" | "COMMS" | "POWER";
  icon: React.ReactNode;
  specs: string;
  role: string;
  status: "ONLINE" | "OPTIMAL" | "STANDBY";
  liveMetricLabel: string;
  liveMetricValue: string;
  dgmsStandard: string;
  description: string;
}

export const HowRoverWorks: React.FC = () => {
  const { telemetry } = useMission();
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string>("vision");
  const [activeStep, setActiveStep] = useState<number>(0);

  const subsystems: Subsystem[] = [
    {
      id: "vision",
      name: "Multi-Spectral Dual Camera Turret",
      category: "VISION",
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      specs: "4K Low-Light RGB + FLIR Lepton 3.5 LWIR (160x120 radiometric thermal, 9Hz-25Hz)",
      role: "Thermal human silhouette recognition in total darkness, dense coal dust, and post-explosion smoke.",
      status: "ONLINE",
      liveMetricLabel: "Thermal Core Temp",
      liveMetricValue: "37.2°C (PRSN-01 Lock)",
      dgmsStandard: "DGMS Tech Circular 02/2023: Subsurface Night & Obscured Vision Criteria",
      description:
        "The turret houses both an ultra-low-light starlight optical camera and a radiometric long-wave infrared (LWIR) thermal imager. The dual streams are hardware-synchronized, allowing the edge AI to overlay thermal heat signatures directly onto the structural geometry of mine tunnels.",
    },
    {
      id: "lidar",
      name: "360° Solid-State 3D LiDAR",
      category: "SENSORS",
      icon: <Crosshair className="h-5 w-5 text-indigo-600" />,
      specs: "16-Beam Solid-State LiDAR, 100m Range, 300,000 pts/sec, ±2cm Accuracy",
      role: "Real-time 2D/3D Simultaneous Localization and Mapping (SLAM) without GPS.",
      status: "OPTIMAL",
      liveMetricLabel: "Point Cloud Density",
      liveMetricValue: "284,000 pts/s",
      dgmsStandard: "DGMS SLAM & Survey Accuracy Standard Grade-I",
      description:
        "Because GPS signals cannot penetrate underground rock strata, the rover utilizes laser odometry and ICP (Iterative Closest Point) graph-SLAM. It continuously constructs a volumetric voxel grid of the mine galleries while estimating its own 6-DOF pose in real time.",
    },
    {
      id: "gas_sniffer",
      name: "Multi-Gas Atmospheric Sniffer Mast",
      category: "SENSORS",
      icon: <Flame className="h-5 w-5 text-amber-600" />,
      specs: "NDIR Pellistor (CH4 0-5%), Electrochemical (CO 0-1000ppm), Galvanic (O2 0-25%)",
      role: "Early detection of methane build-up, toxic carbon monoxide, and oxygen depletion zones.",
      status: "ONLINE",
      liveMetricLabel: "Current CH4 / CO / O2",
      liveMetricValue: `${telemetry.gas.ch4.toFixed(1)}% / ${telemetry.gas.co.toFixed(0)}ppm / ${telemetry.gas.o2.toFixed(1)}%`,
      dgmsStandard: "DGMS Flammable & Toxic Gas Ingress Rules (CMR 1957 / MMR 1961)",
      description:
        "Positioned on the elevated front mast to capture lighter-than-air methane gas pockets floating near the tunnel roof as well as denser toxic fumes. Integrated fail-safe thresholds immediately flag danger corridors for the pathfinding algorithm.",
    },
    {
      id: "strata_sensor",
      name: "Strata Deformation & Seismic Sensor",
      category: "SENSORS",
      icon: <Activity className="h-5 w-5 text-emerald-600" />,
      specs: "Stereoscopic Rock Extensometer + High-Frequency Piezo Micro-Seismic Acoustic Sensor",
      role: "Measures roof crack expansion rates and micro-fractures to predict roof collapses.",
      status: "ONLINE",
      liveMetricLabel: "Displacement Rate",
      liveMetricValue: "+0.8 mm/h (Stable)",
      dgmsStandard: "DGMS Roof Fall Prevention & Strata Management Plan (SMP 2024)",
      description:
        "Analyzes rock joint displacements and micro-seismic acoustic emissions within the rock strata. If the shear displacement exceeds the 5.0mm critical threshold, the corridor is marked as structurally unstable.",
    },
    {
      id: "ai_brain",
      name: "NVIDIA Jetson Orin Edge AI Computer",
      category: "COMPUTE",
      icon: <Cpu className="h-5 w-5 text-purple-600" />,
      specs: "NVIDIA Jetson Orin Nano/NX (Up to 100 TOPS AI Compute, FP16 TensorRT Runtime)",
      role: "Onboard deep learning inference for YOLO-v9 human/hazard detection & A* path synthesis.",
      status: "OPTIMAL",
      liveMetricLabel: "AI Inference Speed",
      liveMetricValue: "28.4 FPS @ 95.2% Conf",
      dgmsStandard: "ISO 13849 Category 3 Autonomous Safe Navigation",
      description:
        "All computer vision, SLAM registration, hazard sensor fusion, and Dijkstra/A* safety path calculations run 100% onboard the rover hardware. The rover does not depend on cloud connectivity and remains fully autonomous even if wireless links drop.",
    },
    {
      id: "mobility",
      name: "4WD All-Terrain Skid-Steer Chassis",
      category: "MOBILITY",
      icon: <Navigation className="h-5 w-5 text-blue-600" />,
      specs: "High-Torque Brushless DC Hub Motors (120 Nm total), IP67 Ingress, 35° Incline Climb",
      role: "Navigates rubble, railway tracks, waterlogged coal slurries, and steep underground crosscuts.",
      status: "ONLINE",
      liveMetricLabel: "Motor Current / Speed",
      liveMetricValue: `5.4A / ${telemetry.speed.toFixed(1)} m/s`,
      dgmsStandard: "DGMS Approved Sub-Surface Flameproof Mobility Certification",
      description:
        "Heavy-duty planetary geared hubs with independent four-wheel drive and differential skid-steering enable zero-radius turns inside narrow 1.8-meter mine shafts and debris-strewn disaster zones.",
    },
    {
      id: "comms",
      name: "Ad-Hoc Wireless Mesh Relay Node",
      category: "COMMS",
      icon: <Radio className="h-5 w-5 text-cyan-600" />,
      specs: "802.11ah Sub-GHz (868/915 MHz) + COFDM Mesh Repeaters with Auto-Healing Topology",
      role: "Penetrates thick coal seams and bends around underground corners to relay video & telemetry.",
      status: "ONLINE",
      liveMetricLabel: "Mesh Signal Quality",
      liveMetricValue: `${telemetry.signalStrength}% (4 Relays Active)`,
      dgmsStandard: "DGMS Intrinsically Safe (Ex-i) Wireless Communications Standard",
      description:
        "Uses ultra-penetrating sub-gigahertz wireless frequencies combined with battery-powered magnetic repeater pucks dropped along the ingress route. The self-forming mesh automatically reroutes packets around rock falls.",
    },
    {
      id: "power",
      name: "Flameproof Ex-d LiFePO4 Power Pack",
      category: "POWER",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      specs: "24V 40Ah Lithium Iron Phosphate (960 Wh) with Intrinsic Safe BMS & ATEX Enclosure",
      role: "Powers all rover subsystems for 6+ hours of continuous autonomous search and rescue.",
      status: "ONLINE",
      liveMetricLabel: "Battery Level & Health",
      liveMetricValue: `${telemetry.battery.toFixed(1)}% (Health: 98%)`,
      dgmsStandard: "DGMS Circular 04/2024: Flameproof Enclosure Ex-d Class I Group A/B",
      description:
        "Housed in an airtight, spark-suppressed explosion-proof cast aluminum enclosure. Even in the event of an internal short circuit or battery fault, the enclosure prevents sparks from igniting surrounding methane atmospheres.",
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: "Shaft Ingress & LiDAR SLAM",
      summary: "Autonomous navigation into deep mine galleries while constructing real-time 2D/3D map.",
      detail:
        "Upon entering the shaft, the 16-beam solid-state LiDAR scans the tunnel walls at 120Hz. Graph-SLAM continuously triangulates distance to rock faces, mapping unexplored crosscuts (0% to 100% coverage) without requiring GPS.",
    },
    {
      step: 2,
      title: "Multi-Hazard Gas & Strata Screening",
      summary: "Detects explosive methane, toxic carbon monoxide, and roof displacement rates.",
      detail:
        "The mast gas sensors sample air every 100ms. If CH4 exceeds the 1.0% DGMS warning threshold or 2.0% critical threshold, the rover isolates the zone, activates intrinsic spark-prevention, and marks the corridor as lethal.",
    },
    {
      step: 3,
      title: "AI Thermal Silhouette Recognition",
      summary: "YOLO-v9 scans thermal heat signatures to detect unconscious survivors.",
      detail:
        "Through dense coal dust or post-fire smoke, the FLIR thermal sensor detects 37.2°C body temperature contours. Edge YOLO-v9 classifies the survivor with 95%+ confidence, logs coordinates, and assesses vital respiration status.",
    },
    {
      step: 4,
      title: "Multi-Risk Safe Corridor Synthesis",
      summary: "Computes optimal rescue team ingress route bypassing all active hazards.",
      detail:
        "The pathfinding engine evaluates candidate routes (Route A, B, C) using a multi-factor cost function: Risk = 0.4(Gas) + 0.35(Strata) + 0.25(Distance). It selects the optimal green corridor (Route B) with zero gas and stable roof support.",
    },
    {
      step: 5,
      title: "Command Dispatch & Relay Telemetry",
      summary: "Broadcasts live coordinates and corridor maps to the surface Rescue Brigade.",
      detail:
        "The rover relays survivor GPS-equivalent coordinates, refuge chamber status, and route navigation waypoints via the subsurface wireless mesh to the surface control room, enabling rapid human evacuation.",
    },
  ];

  const selectedSubsystem =
    subsystems.find((s) => s.id === selectedSubsystemId) || subsystems[0];

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-sky-300 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Rover Architecture • Problem ID: 26039</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            How the Autonomous Mine Rescue Rover Works
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            A comprehensive breakdown of onboard hardware payloads, edge AI algorithms,
            and the 5-stage autonomous exploration & survivor extraction workflow engineered for
            subterranean disaster environments.
          </p>
        </div>
      </div>

      {/* Section 1: 5-Stage Autonomous Operational Workflow */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>5-Step Autonomous Search & Rescue Workflow</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click any stage below to inspect how the rover transitions from ingress to survivor extraction.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full self-start sm:self-auto">
            Autonomous State Machine
          </span>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {workflowSteps.map((ws, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={ws.step}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-xl text-left transition-all border ${
                  isActive
                    ? "bg-blue-50/80 border-blue-300 text-blue-950 shadow-subtle"
                    : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-blue-700">STEP 0{ws.step}</span>
                  {isActive && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ws.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-normal">
                  {ws.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
            <span>Stage 0{workflowSteps[activeStep].step} Deep Dive</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span className="text-slate-900">{workflowSteps[activeStep].title}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {workflowSteps[activeStep].detail}
          </p>
        </div>
      </div>

      {/* Section 2: Interactive Rover Anatomy & Hardware Payloads */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-subtle">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-600" />
            <span>Integrated Rover Subsystems & Sensor Payloads</span>
          </h3>
          <p className="text-xs text-slate-500">
            Select any subsystem from the matrix below to view technical specifications, live sensor readings, and DGMS compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subsystems List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {subsystems.map((sub) => {
              const isSelected = sub.id === selectedSubsystemId;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubsystemId(sub.id)}
                  className={`w-full p-3.5 rounded-xl text-left flex items-center justify-between transition-all border ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-400 text-blue-950 shadow-subtle"
                      : "bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs">
                      {sub.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sub.name}</h4>
                      <span className="text-[11px] text-slate-400 font-medium">{sub.category}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {sub.status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subsystem Details Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs text-blue-600">
                  {selectedSubsystem.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedSubsystem.name}</h4>
                  <span className="text-xs text-blue-700 font-semibold">{selectedSubsystem.role}</span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedSubsystem.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {selectedSubsystem.description}
            </p>

            {/* Key Specs & Live Metric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-[11px] block font-medium">Hardware Specifications</span>
                <span className="text-xs font-semibold text-slate-800 block">
                  {selectedSubsystem.specs}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-[11px] block font-medium">Live Telemetry Feedback</span>
                <span className="text-xs font-bold text-blue-700 font-mono block">
                  {selectedSubsystem.liveMetricValue}
                </span>
              </div>
            </div>

            {/* DGMS Compliance Standard Box */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
              <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block">Indian DGMS Mining Regulatory Alignment:</strong>
                <span className="text-slate-600">{selectedSubsystem.dgmsStandard}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
