"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
} from "@/services/customerService";

type Props = {
  mode: "create" | "edit";
  customerId?: string;
};

export default function CustomerForm({ mode, customerId }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  const router = useRouter();

  useEffect(() => {
    if (mode === "edit" && customerId) {
      const fetchCustomer = async () => {
        try {
          const data = await getCustomerById(customerId);
          setName(data.customerName || data.name);
          setPhone(data.phone);
        } catch {
          alert("Failed to load customer.");
          router.back();
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [mode, customerId, router]);

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Both name and phone are required.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        await createCustomer({ customerName: name, phone });
        alert("Customer created.");
      } else {
        await updateCustomer(customerId!, { customerName: name, phone });
        alert("Customer updated.");
      }
      router.push("/customers");
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-6">
        {mode === "edit" ? "Edit Customer" : "Add New Customer"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
      </button>
    </div>
  );
}
