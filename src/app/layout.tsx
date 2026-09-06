import type { Metadata } from "next";
import "./globals.css";
import { MissionProvider } from "@/context/MissionContext";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "MINE RESCUE COMMAND | SIH 2026",
  description:
    "AI-Powered Underground Mine Safety, Monitoring & Rescue Rover Command Center - Smart India Hackathon 2026 (Problem 26039)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased flex flex-col selection:bg-blue-500 selection:text-white font-sans">
        <MissionProvider>
          <TopBar />
          <div className="flex flex-1 min-h-[calc(100vh-3.5rem)] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50/80 p-5 lg:p-7 clean-grid-bg">
              {children}
            </main>
          </div>
        </MissionProvider>
      </body>
    </html>
  );
}
