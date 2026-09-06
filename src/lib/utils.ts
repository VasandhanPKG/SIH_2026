import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatUtcTime(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

export function formatNumber(val: number, decimals: number = 1): string {
  return val.toFixed(decimals);
}
