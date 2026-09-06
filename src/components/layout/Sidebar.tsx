"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map as MapIcon,
  Video,
  Cpu,
  Users,
  AlertTriangle,
  PlayCircle,
  Activity,
  Settings,
  BatteryCharging,
  Flame,
  Zap,
  Sparkles,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { alerts, telemetry, isEmergencyStopped, currentStage } = useMission();

  const unacknowledgedAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Tactical Map", href: "/tactical-map", icon: MapIcon },
    { name: "Rover Feed", href: "/rover-feed", icon: Video },
    { name: "AI Analysis", href: "/ai-analysis", icon: Cpu },
    { name: "Personnel", href: "/personnel", icon: Users },
    {
      name: "Alerts",
      href: "/alerts",
      icon: AlertTriangle,
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined,
    },
    {
      name: "3D Simulation",
      href: "/simulation",
      icon: PlayCircle,
      highlight: true,
      badge: "3D",
    },
    {
      name: "Simulation Demo",
      href: "/demo",
      icon: Sparkles,
      badge: `Stage ${currentStage.stageNumber}`,
    },
    { name: "Diagnostics", href: "/diagnostics", icon: Activity },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="flex flex-col w-64 border-r border-slate-200/90 bg-white select-none shadow-sm">
      {/* Rover Status Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-800">
              {telemetry.name}
            </span>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isEmergencyStopped
              ? "bg-red-100 text-red-700"
              : telemetry.status === "STANDBY"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}>
            {isEmergencyStopped ? "E-STOP" : telemetry.status}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          ID: {telemetry.roverId} • Sector 7B
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/overview" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all ${
                item.highlight
                  ? isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-blue-50/80 text-blue-700 hover:bg-blue-100/80"
                  : isActive
                  ? "bg-slate-100 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    item.highlight
                      ? isActive
                        ? "text-white"
                        : "text-blue-600"
                      : isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    item.highlight
                      ? isActive
                        ? "bg-white text-blue-700 font-bold"
                        : "bg-blue-200 text-blue-800 font-bold"
                      : "bg-red-500 text-white font-bold"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Telemetry Snapshot Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Telemetry Snapshot</span>
          <span className="text-blue-600 font-semibold">Live</span>
        </div>

        {/* Battery Indicator */}
        <div>
          <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" />
              Battery
            </span>
            <span className={`font-mono font-semibold ${telemetry.battery < 25 ? 'text-red-600' : 'text-slate-800'}`}>
              {telemetry.battery.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 overflow-hidden rounded-full">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                telemetry.battery < 25 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${telemetry.battery}%` }}
            />
          </div>
        </div>

        {/* Methane & Speed chips */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-white border border-slate-200/80 p-2 rounded-xl shadow-subtle">
            <div className="text-slate-400 text-[10px] flex items-center gap-1 font-medium">
              <Flame className="h-3 w-3 text-amber-500" />
              CH4 Gas
            </div>
            <div className={`font-mono font-bold mt-0.5 text-xs ${telemetry.gas.ch4 > 1.0 ? 'text-red-600' : 'text-slate-800'}`}>
              {telemetry.gas.ch4.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 p-2 rounded-xl shadow-subtle">
            <div className="text-slate-400 text-[10px] flex items-center gap-1 font-medium">
              <Zap className="h-3 w-3 text-blue-600" />
              Speed
            </div>
            <div className="font-mono font-bold mt-0.5 text-xs text-blue-700">
              {telemetry.speed.toFixed(1)} m/s
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
