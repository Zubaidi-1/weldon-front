"use client";

import OrdersTable from "@/components/shared/dashboard/admin/orders/OrdersTable";
import ProductDashboardCard from "@/components/shared/dashboard/admin/products/ProductCards";
import CustomSelect from "@/components/shared/ui/DropDown";
import { useGetOrders } from "@/Hooks/order/useGetOrders";
import { useUpdateOrderStatus } from "@/Hooks/order/useUpdateOrderStatus";
import type { OrderStatus } from "@/lib/types/OrderTypes";
import Link from "next/link";
import { useMemo, useState } from "react";

const orderStatuses: (OrderStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const statusOptions = orderStatuses.map((status) => ({
  label: status === "ALL" ? "All Statuses" : status.replaceAll("_", " "),
  value: status,
}));

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const { data, isLoading, isError } = useGetOrders(1, 50);
  const updateOrderStatus = useUpdateOrderStatus();
  const orders = useMemo(() => data?.orders ?? [], [data?.orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders;

    return orders.filter((order) => order.orderStatus === statusFilter);
  }, [orders, statusFilter]);

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING",
  );
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED",
  );
  const revenue = orders.reduce(
    (sum, order) =>
      sum +
      order.products.reduce(
        (orderSum, product) => orderSum + product.lineTotal,
        0,
      ),
    0,
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading orders...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load orders
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-6 py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-[#D8EAF4] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0089D3]">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A]">
              Orders
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Review customer orders and update fulfillment status.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
          >
            Back to dashboard
          </Link>
        </header>

        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ProductDashboardCard
            title="Total Orders"
            value={data?.total ?? orders.length}
            badgeText="All"
            description="All checkout orders currently in the system."
            variant="blue"
          />
          <ProductDashboardCard
            title="Pending"
            value={pendingOrders.length}
            badgeText="Open"
            description="Orders waiting for confirmation."
            variant="yellow"
          />
          <ProductDashboardCard
            title="Delivered"
            value={deliveredOrders.length}
            badgeText="Done"
            description="Orders marked as delivered."
            variant="green"
          />
          <ProductDashboardCard
            title="Revenue"
            value={`$${revenue.toFixed(2)}`}
            badgeText="Gross"
            description="Gross order value from loaded orders."
            variant="blue"
          />
        </section>

        <div className="flex w-full flex-col gap-4 rounded-3xl border border-[#0089D3]/20 bg-white p-4 shadow-[0_8px_30px_rgba(0,137,211,0.08)] md:flex-row md:items-center">
          <CustomSelect<OrderStatus | "ALL">
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="md:w-56"
          />
        </div>

        <OrdersTable
          orders={filteredOrders}
          title="All Orders"
          updatingOrderId={
            updateOrderStatus.isPending
              ? (updateOrderStatus.variables?.orderId ?? null)
              : null
          }
          onStatusChange={(orderId, orderStatus) => {
            updateOrderStatus.mutate({ orderId, orderStatus });
          }}
        />
      </div>
    </main>
  );
}
