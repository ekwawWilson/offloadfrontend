// components/layout/Topbar.tsx
"use client";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  return (
    <header className="bg-blue-700  border-b px-6 py-3 flex items-center justify-between md:justify-end">
      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={onMenuClick}>
        <Menu className="w-6 h-6 text-white" />
      </button>
      <span className="text-sm text-white hidden md:block">
        Welcome {user?.role}:{user?.userName}
      </span>
    </header>
  );
}
