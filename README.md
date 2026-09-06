# MINE RESCUE COMMAND (SIH 2026 — Problem ID 26039)
**AI-Powered Underground Mine Safety, Monitoring & Rescue Rover Command Center**

---

## 🎯 Project Overview
- **Theme:** Smart Automation
- **Category:** Hardware & Edge AI
- **Problem Statement:** AI-Powered Underground Mine Safety, Monitoring & Rescue Rover
- **Station:** Tactical Command & Control (C2) Subsurface Station

**MINE RESCUE COMMAND** is a mission-critical command dashboard for autonomous mine rescue rovers operating in hazardous, GPS-denied underground coal and metal mines. It visualizes LiDAR SLAM cartography, multi-gas pellistors (CH4 / CO / O2), 3-axis IMU rock strata deformation, FLIR thermal human survivor detection, and real-time AI safe route planning.

---

## ⚡ Quick Start (Instant Run)

To launch the dashboard immediately:

```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 8-Stage Mission Simulation Engine (DEMO MODE)

The dashboard includes a synchronized 8-stage rescue mission simulation built specifically for **Smart India Hackathon judging**:

1. **Stage 1 — Mission Initialization:** Subsurface base station self-checks (LiDAR 120Hz, Gas Pellistors, Optical + Thermal cameras, Ad-Hoc Mesh link).
2. **Stage 2 — Rover Deployment:** Autonomous ingress into Sector 7B drift at 1.2 m/s. Telemetry begins active data transmission.
3. **Stage 3 — Underground Mapping:** 3D LiDAR point cloud synthesis reveals unknown mine haulage ways and shafts (12% $\rightarrow$ 100%).
4. **Stage 4 — Hazard Detection:** Combustible Methane (CH4) gas surge to 2.4% LEL and 8.4mm roof rock delamination detected in Tunnel B-04. Hazard pins placed on tactical map.
5. **Stage 5 — Survivor Detection:** Automatic switch to FLIR Thermal HUD. YOLO-v9 multi-spectral model flags survivor `PRSN-01` (37.2°C body temp, 95% AI confidence) inside Refuge Chamber 7B.
6. **Stage 6 — AI Risk Fusion & Safe Path Planning:** Multi-factor risk engine rejects hazardous Route A and synthesizes optimal **Route B** (South Incline Bypass — 100% Safe).
7. **Stage 7 — Rescue Alert & Dispatch Authorization:** Operator receives high-priority dossier and clicks `[ DISPATCH RESCUE TEAM ]`.
8. **Stage 8 — Mission Complete:** Rapid response brigade rendezvous with survivor. Full mission statistics report generated.

---

## 🏗️ Architecture & Dual Data Providers

```
Physical / Simulated Rover
          │
  [Ad-Hoc Wireless Mesh]
          │
  [FastAPI / MQTT Gateway]
          │
    [WebSocket Client]
          │
  ┌───────┴────────┐
  │ DataProvider   │
  ├────────────────┤
  │ MockProvider   │ ──► [DEMO SIMULATION]
  │ LiveProvider   │ ──► [PHYSICAL HARDWARE]
  └───────┬────────┘
          │
[Next.js Tactical C2 Station]
```

---

## 📁 Primary Navigation & Features

- **Overview (`/overview`):** Command center KPI telemetry, gas gauges, mini tactical map, incident feed.
- **Tactical Map (`/tactical-map`):** Interactive SLAM map with pan/zoom, dynamic fog-of-war reveal, layer toggles, and safe-route overlays.
- **Rover Feed (`/rover-feed`):** Dual RGB & Thermal FLIR HUD, pitch/azimuth/depth indicators, D-Pad drive controls, and Emergency Stop.
- **AI Analysis (`/ai-analysis`):** Live sensor fusion bounding boxes, rock strata displacement trend chart, and path synthesis.
- **Personnel (`/personnel`):** Survivor tracking roster, vitals, distance from rover, and click-to-focus locator.
- **Alerts (`/alerts`):** Incident queue categorized into Critical, Warning, and Info with Acknowledge/Resolve actions.
- **DEMO (`/demo`):** Interactive 8-stage simulation with play/pause, stage stepping, speed multipliers (1x/2x/5x), and rescue team dispatching.
- **Diagnostics (`/diagnostics`):** Wireless mesh repeaters (Node 01-04), latency/packet loss metrics, and sensor matrix status.
- **Settings (`/settings`):** Toggle between Live & Demo mode, configure WebSocket/MQTT gateways, and calibrate DGMS safety thresholds.
