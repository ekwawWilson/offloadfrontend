"use client";

import { useRouter } from "next/navigation";

export default function SummaryDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-7mx-auto px-3 py-2">
      <h1 className="text-2xl font-bold mb-6">📈 Sales Summary Reports</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div
          className="bg-gray-100 border-t border-blue-700 hover:bg-blue-100 transition cursor-pointer p-6 rounded-lg shadow-xl"
          onClick={() => router.push("/sales/summary/container")}
        >
          {" "}
          <h2 className="text-lg font-semibold mb-1 text-center">📦</h2>
          <h2 className="text-lg font-semibold mb-1">
            Container Sales Summary
          </h2>
          <p className="text-sm text-gray-600">
            View per-container item sales and remaining stock
          </p>
        </div>

        <div
          className="bg-gray-100 border-t border-blue-700 hover:bg-blue-100 transition cursor-pointer p-6 rounded-lg shadow-xl"
          onClick={() => router.push("/summary/supplier")}
        >
          <h2 className="text-lg font-semibold mb-1 text-center">📊</h2>
          <h2 className="text-lg font-semibold mb-1">Detailed Sales Report</h2>
          <p className="text-sm text-gray-600">
            View item breakdown for each sale filtered by date
          </p>
        </div>

        <div
          className="bg-gray-100 border-t border-blue-700 hover:bg-blue-100 transition cursor-pointer p-6 rounded-lg shadow-xl"
          onClick={() => router.push("/summary/sales/list")}
        >
          <h2 className="text-lg font-semibold mb-1 text-center">🧾</h2>
          <h2 className="text-lg font-semibold mb-1">Sales Summary Report</h2>
          <p className="text-sm text-gray-600">
            Filter all sales by sales type and date
          </p>
        </div>

        <div
          className="bg-gray-100 border-t border-blue-700 hover:bg-blue-100 transition cursor-pointer p-6 rounded-lg shadow-xl"
          onClick={() => router.push("/summary/inventory")}
        >
          {" "}
          <h2 className="text-lg font-semibold mb-1 text-center">📊</h2>
          <h2 className="text-lg font-semibold mb-1">
            Physical Inventory Report
          </h2>
          <p className="text-sm text-gray-600">
            View item breakdown for each sale filtered by date
          </p>
        </div>
      </div>
    </div>
  );
}
