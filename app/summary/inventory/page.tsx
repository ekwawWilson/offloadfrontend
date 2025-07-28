"use client";

import { useEffect, useState } from "react";
import {
  getSuppliers,
  getSupplierItemsWithSales,
} from "@/services/supplierService";
import InventoryReportComponent from "@/components/inventory/InventoryReportComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function InventoryReportPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invData, supData] = await Promise.all([
          getSupplierItemsWithSales(),
          getSuppliers(),
        ]);
        setInventory(invData);
        setSuppliers(supData);
      } catch (err) {
        alert("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <InventoryReportComponent
        inventory={inventory}
        suppliers={suppliers}
        loading={loading}
      />
    </DashboardLayout>
  );
}
