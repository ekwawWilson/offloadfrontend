import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm from "@/components/pages/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <DashboardLayout>
      <CustomerForm mode="create" />
    </DashboardLayout>
  );
}
