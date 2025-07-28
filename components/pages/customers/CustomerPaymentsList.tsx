"use client";
import { useEffect, useState } from "react";
import {
  getCustomerPayments,
  deleteCustomerPayment,
} from "@/services/paymentService";
import { getCustomerById } from "@/services/customerService";

type Props = {
  customerId: string;
};

export default function CustomerPaymentsList({ customerId }: Props) {
  const [payments, setPayments] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const data = await getCustomerPayments(customerId);
      setPayments(data);
    } catch (err) {
      alert("Failed to load payments.");
    }
  };

  const loadCustomer = async () => {
    try {
      const data = await getCustomerById(customerId);
      setCustomerName(data.customerName || data.name);
    } catch {
      alert("Failed to load customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    loadCustomer();
  }, [customerId]);

  const confirmDelete = async (paymentId: string) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
      await deleteCustomerPayment(paymentId);
      await loadPayments();
    } catch (err) {
      alert("Failed to delete payment.");
    }
  };

  const formatCurrency = (value: number) =>
    `GHS ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">
        Payments for: {customerName || "Loading..."}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex justify-between items-center border p-4 rounded bg-gray-50"
            >
              <div>
                <p className="font-semibold">
                  {formatCurrency(payment.amount)}
                </p>
                <p className="text-sm text-gray-600">
                  {payment.note || "No note"} — {payment.paymentType}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => confirmDelete(payment.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
