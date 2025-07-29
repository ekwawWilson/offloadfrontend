// app/customers/[id]/payments/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerPaymentForm from "@/components/pages/customers/CustomerPaymentForm";

export default async function CustomerPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <CustomerPaymentForm customerId={id} />
    </DashboardLayout>
  );
}
