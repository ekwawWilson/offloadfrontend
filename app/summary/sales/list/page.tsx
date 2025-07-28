"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { getSales, deleteSaleById } from "@/services/salesService";
import SalesListComponent from "@/components/pages/sales/SalesListComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SalesListPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const loadSales = async () => {
    try {
      setLoading(true);
      const result = await getSales(
        startDate ? moment(startDate).format("YYYY-MM-DD") : "",
        endDate ? moment(endDate).format("YYYY-MM-DD") : ""
      );
      setSales(result);
    } catch (err) {
      alert("Failed to load sales.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSaleById(id);
      loadSales();
    } catch (err) {
      alert("Failed to delete sale.");
      console.error(err);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <DashboardLayout>
      <SalesListComponent
        sales={sales}
        loading={loading}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReload={loadSales}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
}
