export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          🧾 Sales Today: GHC 0.00
        </div>
        <div className="bg-white p-4 rounded shadow">
          💰 Credit Balance: GHC 0.00
        </div>
        <div className="bg-white p-4 rounded shadow">👥 Customers: 0</div>
      </div>
    </div>
  );
}
