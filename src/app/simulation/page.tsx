import { Metadata } from "next";
import { MineRescueSimulator } from "@/components/simulator/MineRescueSimulator";

export const metadata: Metadata = {
  title: "3D Mission Simulation | MINE RESCUE COMMAND (SIH 2026)",
  description: "Interactive 3D underground mine rescue rover mission simulation demonstrating 5 core pillars: Explore, Monitor, Detect, Analyse, Connect.",
};

export default function SimulationPage() {
  return <MineRescueSimulator />;
}
