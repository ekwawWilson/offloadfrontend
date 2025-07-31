"use client";

import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";
import { formatCurrency } from "@/utils/format";
import ActionModal from "@/components/shared/ActionModal";
import { PlusCircle, Eye } from "lucide-react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  phone: string;
  balance: number;
};

const ITEMS_PER_PAGE = 10;

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filtered.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full sm:w-96 p-3 border rounded mb-6"
      />

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : (
        <>
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
                {paginatedCustomers.map((c) => (
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
                        <Eye className="w-5 h-5 hover:text-gray-600 text-blue-600 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2 text-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
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
