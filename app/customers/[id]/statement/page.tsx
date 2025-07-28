import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerStatement from "@/components/pages/customers/CustomerStatement";

type Props = {
  params: { id: string };
};

export default function CustomerStatementPage({ params }: Props) {
  return (
    <DashboardLayout>
      <CustomerStatement customerId={params.id} />
    </DashboardLayout>
  );
}
