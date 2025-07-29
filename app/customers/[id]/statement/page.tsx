// app/customers/[id]/statement/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerStatement from "@/components/pages/customers/CustomerStatement";

export default async function CustomerStatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <CustomerStatement customerId={id} />
    </DashboardLayout>
  );
}
