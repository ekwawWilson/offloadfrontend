// app/customers/[id]/page.tsx

import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm from "@/components/pages/customers/CustomerForm";

// ✅ This must be an `async` function if you’re using generateMetadata or loading data server-side
export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <DashboardLayout>
      <CustomerForm mode="edit" customerId={resolvedParams.id} />
    </DashboardLayout>
  );
}
