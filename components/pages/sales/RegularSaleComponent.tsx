"use client";

import { useEffect, useMemo, useState } from "react";
import { getCustomers } from "@/services/customerService";
import { getSupplierItemsWithSales } from "@/services/supplierService";
import { recordSale } from "@/services/salesService";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";
import classNames from "classnames";
import { Dialog } from "@headlessui/react";
import { printReceiptHTML } from "@/lib/printReceipts";

type Item = {
  id: string;
  itemName: string;
  supplierName: string;
  available: number;
  unitPrice: number;
};

type CustomerOption = {
  label: string;
  value: string;
};

export default function RegularSaleComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [saleType, setSaleType] = useState<"cash" | "credit">("cash");
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCreditPrompt, setShowCreditPrompt] = useState(false);
  const [showPrintPrompt, setShowPrintPrompt] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [custData, itemData] = await Promise.all([
          getCustomers(),
          getSupplierItemsWithSales(),
        ]);
        setCustomers(
          custData.map((c: any) => ({
            label: `${c.name} (${c.phone})`,
            value: c.id,
          }))
        );
        setItems(itemData);
      } catch {
        toast.error("Failed to load data.");
      }
    })();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.itemName.toLowerCase().includes(search.toLowerCase()) ||
          item.supplierName.toLowerCase().includes(search.toLowerCase())
      ),
    [search, items]
  );

  const addToCart = (item: Item) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      if (exists.qty < item.available) {
        setCart((prev) =>
          prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
        );
      } else {
        toast.error("No more stock available");
      }
    } else {
      if (item.available > 0) {
        setCart((prev) => [{ ...item, qty: 1 }, ...prev]); // New on top
      } else {
        toast.error("Item is out of stock");
      }
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updatePriceInCart = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price) && price >= 0) {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, unitPrice: price } : i))
      );
    }
  };

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
    [cart]
  );

  const handleConfirmSale = () => {
    if (!selectedCustomer) {
      toast.error("Select a customer first.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    setShowConfirmModal(true);
  };

  const finalizeSale = async () => {
    if (loading) return;

    setShowConfirmModal(false);
    try {
      setLoading(true);
      await recordSale({
        sourceType: "regular",
        sourceId: selectedCustomer?.value!,
        customerId: selectedCustomer?.value!,
        saleType,
        items: cart.map((i) => ({
          itemName: i.itemName,
          quantity: i.qty,
          unitPrice: i.unitPrice,
        })),
      });

      toast.success("Sale recorded");

      // Step 1: Offer print
      setShowPrintPrompt(true);
    } catch {
      toast.error("Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setShowPrintPrompt(false);

    // ✅ Clone state first
    const clonedCart = [...cart];
    const clonedCustomer = selectedCustomer;

    // ✅ Trigger receipt generation with the cloned data
    printReceiptHTML({
      customer: clonedCustomer?.label || "N/A",
      items: clonedCart.map((i) => ({
        itemName: i.itemName,
        qty: i.qty,
        unitPrice: i.unitPrice,
      })),
      total,
      saleType,
    });

    // ✅ Then clear state
    setCart([]);

    if (saleType === "credit") {
      setShowCreditPrompt(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 border-b border-blue-700 rounded-lg shadow-md bg-white overflow-x-hidden">
      <h1 className="text-2xl font-bold text-blue-700">Regular Sale</h1>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Customer</label>
          <Select
            options={customers}
            value={selectedCustomer}
            onChange={(opt) => setSelectedCustomer(opt)}
            placeholder="Search and select customer"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Sale Type</label>
          <div className="flex space-x-3">
            <button
              onClick={() => setSaleType("cash")}
              className={classNames(
                "px-4 py-2 rounded",
                saleType === "cash"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              Cash
            </button>
            <button
              onClick={() => setSaleType("credit")}
              className={classNames(
                "px-4 py-2 rounded",
                saleType === "credit"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              Credit
            </button>
          </div>
        </div>
      </div>

      {/* Item List */}
      <div>
        <input
          className="w-full sm:w-1/2 border border-gray-100 rounded px-3 py-2 text-sm mb-3"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="border-t rounded overflow-y-auto max-h-55">
          <table className="w-full text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Supplier</th>
                <th className="px-4 py-2">Available</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="cursor-pointer hover:bg-blue-50 border-t"
                >
                  <td className="px-4 py-2">{item.itemName}</td>
                  <td className="px-4 py-2">{item.supplierName}</td>
                  <td className="px-4 py-2">{item.available}</td>
                  <td className="px-4 py-2">₵ {item.unitPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cart Section */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Item Cart</h2>
        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">No items selected...</p>
        ) : (
          <div className="overflow-y-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.itemName}</td>
                    <td className="px-4 py-2">{item.qty}</td>
                    <td className="px-4 py-2">
                      {isAdmin ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updatePriceInCart(item.id, e.target.value)
                          }
                          className="border px-2 py-1 rounded w-24"
                        />
                      ) : (
                        <span>₵ {item.unitPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      ₵ {(item.qty * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-right font-bold text-lg text-blue-700">
          Total: ₵ {total.toFixed(2)}
        </div>

        <button
          disabled={loading}
          onClick={handleConfirmSale}
          className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Finalize Sale"}
        </button>
      </div>

      {/* Confirmation Modal */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        className="fixed z-50 inset-0"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Sale
            </Dialog.Title>
            <p>Are you sure you want to finalize this sale?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-sm px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={finalizeSale}
                className="text-sm px-4 py-2 bg-blue-700 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Print Modal */}
      <Dialog
        open={showPrintPrompt}
        onClose={() => setShowPrintPrompt(false)}
        className="fixed z-50 inset-0"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
            <Dialog.Title className="text-lg font-semibold">
              Print Receipt
            </Dialog.Title>
            <p>Do you want to print the receipt?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={async () => {
                  setShowPrintPrompt(false);
                  if (saleType === "credit") setShowCreditPrompt(true);
                  setCart([]);
                  try {
                    const itemData = await getSupplierItemsWithSales();
                    setItems(itemData); // reload items
                  } catch {
                    toast.error("Failed to reload items.");
                  }
                }}
                className="text-sm px-4 py-2 bg-gray-200 rounded"
              >
                Skip
              </button>
              <button
                onClick={handlePrint}
                className="text-sm px-4 py-2 bg-blue-700 text-white rounded"
              >
                Print
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Credit Payment Modal */}
      <Dialog
        open={showCreditPrompt}
        onClose={() => setShowCreditPrompt(false)}
        className="fixed z-50 inset-0"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
            <Dialog.Title className="text-lg font-semibold">
              Record Payment?
            </Dialog.Title>
            <p>Would you like to record a payment for this credit sale now?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={async () => {
                  setShowCreditPrompt(false);
                  setSelectedCustomer(null); // clear customer
                  setCart([]); // optional: also clear cart if needed
                  try {
                    const itemData = await getSupplierItemsWithSales();
                    setItems(itemData); // reload items
                  } catch {
                    toast.error("Failed to reload items.");
                  }
                }}
                className="text-sm px-4 py-2 bg-gray-200 rounded"
              >
                Later
              </button>
              <button
                onClick={() => {
                  if (selectedCustomer) {
                    router.push(
                      `/customers/${selectedCustomer.value}/payments`
                    );
                  }
                }}
                className="text-sm px-4 py-2 bg-blue-700 text-white rounded"
              >
                Record Payment
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
