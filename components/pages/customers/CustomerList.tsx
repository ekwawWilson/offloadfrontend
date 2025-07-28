"use client";
import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";
import { formatCurrency } from "@/utils/format";
import ActionModal from "@/components/shared/ActionModal";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Eye } from "lucide-react";
type Customer = {
  id: string;
  name: string;
  phone: string;
  balance: number;
};

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query)
      )
    );
  }, [search, customers]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link
          href="/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          Add Customer
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-96 p-3 border rounded mb-6"
      />

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="p-3">Name</th>
                <th className="p-3 hidden sm:table-cell">Phone</th>
                <th className="p-3">Balance</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-blue-100 text-sm transition-all"
                >
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 hidden sm:table-cell">{c.phone}</td>
                  <td
                    className={`p-3 font-medium ${
                      c.balance > 0
                        ? "text-red-600"
                        : c.balance < 0
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    {formatCurrency(c.balance)}
                  </td>
                  <td className="p-3 text-left">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <Eye className="w-5 h-5 hover:text-gray-600 text-blue-600 cursor-pointer  " />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <ActionModal
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />
    </div>
  );
}
