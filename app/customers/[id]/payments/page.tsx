import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerPaymentForm from "@/components/pages/customers/CustomerPaymentForm";

type Props = {
  params: { id: string };
};

export default function CustomerPaymentPage({ params }: Props) {
  return (
    <DashboardLayout>
      <CustomerPaymentForm customerId={params.id} />
    </DashboardLayout>
  );
}
