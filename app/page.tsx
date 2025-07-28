"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <Image
          src="/eyo.png"
          alt="Company Logo"
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
            <Image
              src="/icons/box.svg"
              alt="Containers"
              width={40}
              height={40}
              className="mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Container Tracking</h3>
            <p className="text-sm text-gray-600">
              Stay on top of your incoming inventory and optimize delivery
              schedules.
            </p>
          </div>
          <div>
            <Image
              src="/icons/sales.svg"
              alt="Sales"
              width={40}
              height={40}
              className="mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Sales Insights</h3>
            <p className="text-sm text-gray-600">
              Visualize daily, weekly, and monthly sales trends across branches.
            </p>
          </div>
          <div>
            <Image
              src="/icons/users.svg"
              alt="Users"
              width={40}
              height={40}
              className="mx-auto mb-4"
            />
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
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </div>
  );
}
