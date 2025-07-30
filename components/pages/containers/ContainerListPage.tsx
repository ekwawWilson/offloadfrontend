"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getContainers,
  markAsReceived,
  deleteContainer,
} from "@/services/containerService";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";

type ContainerData = {
  id: string;
  number: string;
  company: string;
  deliveryDate: string;
  status: "Pending" | "Received" | "Done";
};

export default function ContainerListPage() {
  const [containers, setContainers] = useState<ContainerData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContainers();
      setContainers(data);
    } catch {
      toast.error("Failed to fetch containers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = containers.filter((c) =>
    c.number.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkReceived = async (id: string) => {
    try {
      await markAsReceived(id);
      setContainers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Received" } : c))
      );
      toast.success("Marked as received");
      window.location.href = `/offload/${id}`;
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContainer(id);
      setContainers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Container deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setSelectedId(null);
    }
  };

  const statusBadge = (status: string) => {
    const base = "px-2 py-0.5 text-xs rounded font-medium";
    switch (status) {
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "Received":
        return `${base} bg-green-100 text-green-800`;
      case "Done":
        return `${base} bg-blue-100 text-blue-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Link
          href="/containers/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          + Add Container
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by container number..."
        className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded mb-5 shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Number</th>
              <th className="p-3">Company</th>
              <th className="p-3 hidden md:table-cell">Delivery Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No containers found.
                </td>
              </tr>
            )}
            {filtered.map((item, i) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium text-blue-800">{item.number}</td>
                <td className="p-3 text-gray-700">{item.company}</td>
                <td className="p-3 hidden md:table-cell text-gray-600">
                  {format(new Date(item.deliveryDate), "dd MMM yyyy")}
                </td>
                <td className="p-3">
                  <span className={statusBadge(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-left">
                  <button
                    onClick={() => setSelectedId(item.id)}
                    className="text-lg px-2 py-1 rounded hover:bg-gray-100"
                  >
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading containers...
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              Container Actions
            </Dialog.Title>
            <button
              onClick={() => {
                handleDelete(selectedId!);
              }}
              className="w-full px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm"
            >
              Delete Container
            </button>
            <button
              onClick={() => {
                setSelectedId(null);
                window.location.href = `/sales/container/${selectedId}`;
              }}
              className="w-full px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-sm"
            >
              Make Sale in Container
            </button>
            <button
              onClick={() => {
                setSelectedId(null);
                handleMarkReceived(selectedId!);
              }}
              className="w-full px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded text-sm"
            >
              Perform Offload
            </button>
            <button
              onClick={() => {
                setSelectedId(null);
                window.location.href = `/summary/container/${selectedId}`;
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded text-sm"
            >
              Container Sales Report
            </button>
            <button
              onClick={() => setSelectedId(null)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm"
            >
              Cancel
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
