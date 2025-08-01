"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Sidebar (mobile + desktop) */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="fixed top-0 left-0  right-0 z-30">
          <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        </div>

        {/* Page content */}
        <main className="mt-16 py-2">
          <div className="max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
