"use client";

import { useEffect, useState } from "react";
import { getContainerSalesSummary } from "@/services/containerService";
import { formatCurrency } from "@/utils/format";
import { useParams } from "next/navigation";
import html2pdf from "html2pdf.js";
import Button from "../shared/Button";
import LoadingSpinner from "../shared/LoadingSpinner";

type Item = {
  name: string;
  expected: number;
  remainingQty: number;
  sold: number;
  unitPrice: number;
  total: number;
};

type ContainerSummary = {
  id: string;
  number: string;
  company: string;
  deliveryDate: string | Date;
  totalSales: number;
  items: Item[];
};

export default function ContainerSummaryComponent() {
  const { id } = useParams();
  const [container, setContainer] = useState<ContainerSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id || typeof id !== "string") return;
      try {
        setLoading(true);
        const data = await getContainerSalesSummary(id);
        setContainer(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleExportPDF = () => {
    if (!container) return;
    const element = document.getElementById("container-summary-print");
    if (element) {
      html2pdf().from(element).save(`ContainerSummary-${container.number}.pdf`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!container) return <p className="text-gray-600">No summary found.</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">
          Container Sales Summary: {container.number}
        </h1>
        <Button onClick={handleExportPDF}>📄 Export to PDF</Button>
      </div>

      <div id="container-summary-print">
        <p>
          <strong>Company:</strong> {container.company}
        </p>
        <p>
          <strong>Delivery Date:</strong>{" "}
          {new Date(container.deliveryDate).toDateString()}
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Item</th>
                <th className="border px-2 py-1 text-left">Sold</th>
                <th className="border px-2 py-1 text-left">Remaining</th>
                <th className="border px-2 py-1 text-left">Unit Price</th>
                <th className="border px-2 py-1 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {container.items.map((item, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.sold}</td>
                  <td className="border px-2 py-1">{item.remainingQty}</td>
                  <td className="border px-2 py-1">
                    ₵ {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="border px-2 py-1">
                    ₵ {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-gray-50">
                <td className="border px-2 py-1 text-right" colSpan={4}>
                  Grand Total
                </td>
                <td className="border px-2 py-1">
                  ₵ {formatCurrency(container.totalSales)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
