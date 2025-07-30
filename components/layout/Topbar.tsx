"use client";

import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-blue-700 border-b px-6 py-3 flex items-center justify-between md:justify-end">
      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={onMenuClick}>
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Welcome dropdown (desktop only) */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-sm text-white flex items-center gap-1 hover:text-gray-100"
        >
          Welcome {user?.role}:{user?.userName}
          <ChevronDown className="w-4 h-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white  rounded shadow z-50">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
