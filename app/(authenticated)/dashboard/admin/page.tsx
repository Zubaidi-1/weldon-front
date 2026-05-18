import DashboardCard from "@/components/shared/dashboard/admin/Cards";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center w-full">
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-3xl text-black font-bold">Insights</h1>
        <div className="flex gap-9">
          <DashboardCard
            title="Total Sales"
            value="$1,000,000"
            tag="Sales"
            period="May 1 - May 6"
            changeValue="+$400"
            changeText="20% rise over the last month"
            buttonText="See Sales Report"
          />

          <DashboardCard
            title="Total Orders"
            value="12,845"
            tag="Orders"
            period="May 1 - May 6"
            changeValue="+1,240"
            changeText="12% increase compared to last week"
            buttonText="View Orders"
          />

          <DashboardCard
            title="Active Users"
            value="8,492"
            tag="Users"
            period="May 1 - May 6"
            changeValue="+824"
            changeText="18% growth in active users this month"
            buttonText="Manage Users"
          />
        </div>
      </div>
    </div>
  );
}
