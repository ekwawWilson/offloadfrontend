// app/customers/[id]/sales/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerSalesList from "@/components/pages/sales/CustomerSalesList";

export default async function CustomerSalesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <CustomerSalesList customerId={id} />
    </DashboardLayout>
  );
}
