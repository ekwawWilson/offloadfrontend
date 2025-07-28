import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerSalesList from "@/components/pages/sales/CustomerSalesList";

type Props = {
  params: { id: string };
};

export default function CustomerSalesPage({ params }: Props) {
  return (
    <DashboardLayout>
      <CustomerSalesList customerId={params.id} />
    </DashboardLayout>
  );
}
