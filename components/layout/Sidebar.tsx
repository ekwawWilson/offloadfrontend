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
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Users", href: "/users", icon: UserPlus },
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
  const { user } = useAuth();

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/30 z-40 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 w-64 h-screen bg-blue-50 shadow-md transform transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:block"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between text-lg font-bold text-blue-700">
          PETROS
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2 rounded-2xl hover:bg-blue-100",
                pathname.startsWith(href) &&
                  "bg-blue-100 text-blue-700 font-semibold"
              )}
              onClick={() => setOpen(false)}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 text-sm text-gray-600 border-t">
          Logged in as <br />
          <span className="font-medium">{user?.email}</span>
        </div>
      </aside>
    </>
  );
}
