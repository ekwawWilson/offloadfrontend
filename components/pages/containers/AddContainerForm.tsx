"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createContainer } from "@/services/containerService";
import { getSuppliers, getSupplierItems } from "@/services/supplierService";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

type ParsedExcelItem = {
  itemName: string;
  quantity: number;
  unitPrice: number;
};

export default function AddContainerForm() {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [containerNo, setContainerNo] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [supplierItems, setSupplierItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<ParsedExcelItem[]>([]);
  const [mode, setMode] = useState<"none" | "excel" | "supplier">("none");

  useEffect(() => {
    getSuppliers().then((res) => {
      setSupplierOptions(
        res.map((s: any) => ({ label: s.suppliername, value: s.id }))
      );
    });
  }, []);

  useEffect(() => {
    if (!supplierId) return;
    getSupplierItems(supplierId).then((items) => {
      setSupplierItems(items);
    });
  }, [supplierId]);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsed = XLSX.utils.sheet_to_json(worksheet) as ParsedExcelItem[];
    setSelectedItems(parsed);
  };

  const handleQuantityChange = (itemName: string, qty: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.itemName === itemName ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (
      !year ||
      !containerNo ||
      !arrivalDate ||
      !supplierId ||
      mode === "none"
    ) {
      toast.error("All fields are required and mode must be selected.");
      return;
    }

    const validItems = selectedItems.filter((i) => i.quantity > 0);
    if (validItems.length === 0) {
      toast.error("Please add at least one item with quantity > 0.");
      return;
    }

    const payload = {
      year: parseInt(year),
      containerNo,
      arrivalDate,
      supplierId,
      items: validItems,
    };

    try {
      await createContainer(payload);
      toast.success("Container added");
      router.push("/containers");
    } catch {
      toast.error("Failed to create container");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-bold">Add Container</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Container Number"
          value={containerNo}
          onChange={(e) => setContainerNo(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          placeholder="Arrival Date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Supplier</option>
          {supplierOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setMode("supplier")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Load from Supplier
        </button>
        <label className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">
          Upload Excel
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelUpload}
            hidden
            onClick={() => setMode("excel")}
          />
        </label>
        <a
          href="/templates/container_template.xlsx"
          download
          className="text-sm text-blue-700 underline"
        >
          Download Excel Template
        </a>
      </div>

      {mode !== "none" && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {(mode === "excel"
                ? selectedItems
                : supplierItems.map((item: any) => ({
                    itemName: item.itemName,
                    unitPrice: item.price,
                    quantity:
                      selectedItems.find((i) => i.itemName === item.itemName)
                        ?.quantity || 0,
                  }))
              ).map((item, i) => (
                <tr key={i}>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.itemName,
                          parseInt(e.target.value)
                        )
                      }
                      className="border p-1 rounded w-24"
                    />
                  </td>
                  <td className="border p-2">
                    GHS {item.unitPrice?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-4 text-right">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Container
        </button>
      </div>
    </div>
  );
}
