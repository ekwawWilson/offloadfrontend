import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm from "@/components/pages/customers/CustomerForm";

type Props = {
  params: { id: string };
};

export default function EditCustomerPage({ params }: Props) {
  return (
    <DashboardLayout>
      <CustomerForm mode="edit" customerId={params.id} />
    </DashboardLayout>
  );
}
