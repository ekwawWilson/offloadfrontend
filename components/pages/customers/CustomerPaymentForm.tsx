"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCustomerPayment,
  getCustomerById,
} from "@/services/customerService";

type Props = {
  customerId: string;
};

export default function CustomerPaymentForm({ customerId }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(customerId);
        setCustomerName(data.customerName || data.name);
      } catch {
        alert("Failed to load customer info");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId, router]);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Enter a valid amount");
      return;
    }
    if (!paymentType) {
      alert("Select a payment type");
      return;
    }

    setSubmitting(true);
    try {
      await createCustomerPayment(customerId, {
        amount: parseFloat(amount),
        note,
        paymentType,
      });
      alert(`GHS ${amount} payment recorded for ${customerName}`);
      router.push(`/customers`);
    } catch {
      alert("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Payment for: {customerName}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date</label>
        <div className="border rounded p-2 bg-gray-100">{today}</div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount (GHS)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter amount"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Note</label>
        <select
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select note type</option>
          <option value="Part Payment">Part Payment</option>
          <option value="Final Payment">Final Payment</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Payment Mode</label>
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select payment type</option>
          <option value="CASH">CASH</option>
          <option value="BANK">BANK</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Saving..." : "Save Payment"}
      </button>
    </div>
  );
}
