"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "cyan" | "green" | "amber" | "red" | "blue";
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  badge,
}) => {
  const iconVariants = {
    cyan: "bg-sky-50 text-sky-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  const badgeVariants = {
    cyan: "bg-sky-50 text-sky-700 border-sky-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-subtle hover:shadow-card transition-all flex flex-col justify-between select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className={`text-[10px] px-2 py-0.5 font-semibold rounded-full border ${badgeVariants[variant]}`}>
              {badge}
            </span>
          )}
          <div className={`p-2 rounded-xl ${iconVariants[variant]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {subtitle && (
          <div className="text-[11px] font-medium text-slate-400 mt-1 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
