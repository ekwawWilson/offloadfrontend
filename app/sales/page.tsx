"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SalesOptionCard from "@/components/sales/SalesOptionCard";

export default function SalesDashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-2 py-8">
        <h1 className="text-2xl font-bold mb-6">Sales by</h1>
        <div className="grid gap-6 sm:grid-cols-3">
          <SalesOptionCard
            icon={<span>📦</span>}
            title="Container Sales"
            description="Sell items by container number"
            href="/sales/container"
          />
          <SalesOptionCard
            icon={<span>🧾</span>}
            title="Regular Sales"
            description="Sell items by supplier"
            href="/sales/regular"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
