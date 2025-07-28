"use client";

import { useEffect, useState } from "react";
import {
  getSuppliers,
  getSupplierItemsWithSales,
} from "@/services/supplierService";
import InventoryReportComponent from "@/components/inventory/InventoryReportComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";

type InventoryItem = {
  id: string;
  itemName: string;
  supplierName: string;
  available: number;
  unitPrice: number;
};

type Supplier = {
  id: string;
  suppliername: string;
};

export default function InventoryReportPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
