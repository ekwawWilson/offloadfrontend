"use client";

import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between md:justify-end shadow-sm">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors" 
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Welcome dropdown (desktop only) */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {user?.userName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                {user?.userName || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role}
              </p>
            </div>
          </div>
          <ChevronDown className={clsx(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            dropdownOpen && "rotate-180"
          )} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-fade-in">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.userName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.userName || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="status-dot status-online"></div>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-xs text-gray-500">End your session</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
