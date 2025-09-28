// components/layout/Sidebar.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Users,
  UserPlus,
  X,
  List,
  ShoppingCart,
  Truck,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Containers", href: "/containers", icon: Truck },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Report", href: "/summary", icon: List },
];

type SidebarProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/30 z-40 transition-all duration-300 md:hidden backdrop-blur-sm",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 w-72 h-screen bg-white shadow-xl border-r border-gray-100 transform transition-all duration-300 md:translate-x-0 animate-slide-in",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:block"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PETROS</h1>
                <p className="text-xs text-blue-100">Business Suite</p>
              </div>
            </div>
            <button 
              className="md:hidden p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors" 
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={name}
                  href={href}
                  className={clsx(
                    "group flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <div className={clsx(
                    "p-2 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-gray-100 group-hover:bg-gray-200"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{name}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.userName || 'User'}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="status-dot status-online"></div>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-medium">{user?.role}</p>
              <p className="truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Logout (mobile only) */}
        <div className="p-4 md:hidden border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium hover:scale-[1.02]"
          >
            <div className="p-2 rounded-xl bg-red-100">
              <LogOut className="w-4 h-4" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
