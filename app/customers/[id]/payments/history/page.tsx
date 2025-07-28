import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerPaymentsList from "@/components/pages/customers/CustomerPaymentsList";

type Props = {
  params: { id: string };
};

export default function PaymentHistoryPage({ params }: Props) {
  return (
    <DashboardLayout>
      <CustomerPaymentsList customerId={params.id} />
    </DashboardLayout>
  );
}
