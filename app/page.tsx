"use client";
import Link from "next/link";
import Image from "next/image";
import { Boxes, BarChart2, Users } from "lucide-react"; // ✅ imported icons

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <Image
          src="/icon/eyo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-6"
        />
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">
          Simplify Your Sales & Inventory Management
        </h1>
        <p className="mt-4 text-lg max-w-xl text-white/90">
          Manage containers, track sales, monitor branches and customers—all in
          one platform.
        </p>
        <Link
          href="/login"
          className="mt-8 px-6 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-gray-100 transition"
        >
          Login
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <Boxes size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Container Tracking</h3>
            <p className="text-sm text-gray-600">
              Stay on top of your incoming inventory and optimize delivery
              schedules.
            </p>
          </div>
          <div>
            <BarChart2 size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Sales Insights</h3>
            <p className="text-sm text-gray-600">
              Visualize daily, weekly, and monthly sales trends across branches.
            </p>
          </div>
          <div>
            <Users size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
            <p className="text-sm text-gray-600">
              Track credit sales, customer payments, and outstanding balances
              easily.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EYO SOLUTIONS All rights reserved.
      </footer>
    </div>
  );
}
