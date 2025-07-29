// app/customers/[id]/payments/history/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerPaymentsList from "@/components/pages/customers/CustomerPaymentsList";

export default async function PaymentHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <CustomerPaymentsList customerId={id} />
    </DashboardLayout>
  );
}
