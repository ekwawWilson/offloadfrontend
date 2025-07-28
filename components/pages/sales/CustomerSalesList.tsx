"use client";
import { useEffect, useState } from "react";
import { getCustomerById } from "@/services/customerService";
import { getSalesByCustomerId } from "@/services/salesService";

type Props = {
  customerId: string;
};

type Sale = {
  id: string;
  saleDate: string;
  totalAmount: number;
};

export default function CustomerSalesList({ customerId }: Props) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await getSalesByCustomerId(customerId);
        setSales(data);
      } catch {
        alert("Failed to fetch sales.");
      } finally {
        setLoading(false);
      }
    };

    const loadCustomer = async () => {
      try {
        const data = await getCustomerById(customerId);
        setCustomerName(data.customerName || data.name);
      } catch {
        alert("Failed to load customer.");
      }
    };

    loadCustomer();
    loadSales();
  }, [customerId]);

  const formatCurrency = (value: number) =>
    `₵ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Sales for: {customerName}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <p>No sales found for this customer.</p>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="p-4 rounded border bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  {new Date(sale.saleDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="font-semibold text-lg">
                  {formatCurrency(sale.totalAmount)}
                </p>
              </div>
              {/* Optional action for future: Edit/View */}
              {/* <Link href={`/sales/${sale.id}`} className="text-blue-600 text-sm">View</Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
