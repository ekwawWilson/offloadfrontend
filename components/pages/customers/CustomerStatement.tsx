"use client";
import { useEffect, useState } from "react";
import {
  getCustomerById,
  getCustomerStatement,
} from "@/services/customerService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type StatementEntry = {
  id: string;
  date: string;
  type: "sale" | "payment";
  description: string;
  amount: number;
};

type Props = {
  customerId: string;
};

export default function CustomerStatement({ customerId }: Props) {
  const [statement, setStatement] = useState<StatementEntry[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(customerId);
        setCustomerName(data.customerName || data.name);
      } catch {
        alert("Failed to load customer.");
      }
    };

    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    fetchStatement();
  }, [fromDate, toDate]);

  const fetchStatement = async () => {
    try {
      setLoading(true);
      const data = await getCustomerStatement(customerId, fromDate, toDate);
      setStatement(data);
    } catch {
      alert("Failed to fetch statement");
    } finally {
      setLoading(false);
    }
  };

  // Compute running balances
  let balance = 0;
  const entries = statement.map((entry) => {
    const isSale = entry.type === "sale";
    const debit = isSale ? entry.amount : 0;
    const credit = !isSale ? entry.amount : 0;
    balance += isSale ? entry.amount : -entry.amount;

    return { ...entry, debit, credit, balance };
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Customer Statement - ${customerName}`, 14, 14);

    autoTable(doc, {
      startY: 20,
      head: [["Date", "Description", "Debit", "Credit", "Balance"]],
      body: entries.map((e) => [
        e.date,
        e.description,
        e.debit.toFixed(2),
        e.credit.toFixed(2),
        e.balance.toFixed(2),
      ]),
    });

    doc.save(`statement_${customerName}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Statement for {customerName}</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="self-end">
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export to PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Debit</th>
                <th className="p-2 border">Credit</th>
                <th className="p-2 border">Balance</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="p-2 border">{entry.date}</td>
                  <td className="p-2 border">{entry.description}</td>
                  <td className="p-2 border text-red-600">
                    {entry.debit > 0 ? entry.debit.toFixed(2) : ""}
                  </td>
                  <td className="p-2 border text-green-600">
                    {entry.credit > 0 ? entry.credit.toFixed(2) : ""}
                  </td>
                  <td className="p-2 border">{entry.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
