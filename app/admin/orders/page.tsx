"use client";

import OrdersTable from "@/components/shared/dashboard/admin/orders/OrdersTable";
import ProductDashboardCard from "@/components/shared/dashboard/admin/products/ProductCards";
import CustomSelect from "@/components/shared/ui/DropDown";
import { useGetAllOrders } from "@/Hooks/order/useGetOrders";
import { useUpdateOrderStatus } from "@/Hooks/order/useUpdateOrderStatus";
import { useDebounce } from "@/Hooks/useDebounce";
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

const limitOptions = [10, 25, 50];

const getDayStart = (value: string) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDayEnd = (value: string) => {
  if (!value) return null;

  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery.trim(), 350);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError, isFetching } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const orders = useMemo(() => data?.orders ?? [], [data?.orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = debouncedSearch.toLowerCase();
    const from = getDayStart(dateFrom);
    const to = getDayEnd(dateTo);

    return orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      const haystack = [
        order.orderId,
        order.orderEmail,
        order.orderPhoneNumber,
        order.orderFirstName,
        order.orderLastName,
        order.orderGovernate,
        order.orderAddress,
        order.orderStatus,
        ...order.products.map((product) => product.productName),
      ]
        .join(" ")
        .toLowerCase();

      if (statusFilter !== "ALL" && order.orderStatus !== statusFilter) {
        return false;
      }

      if (normalizedSearch && !haystack.includes(normalizedSearch)) {
        return false;
      }

      if (from && createdAt < from) return false;
      if (to && createdAt > to) return false;

      return true;
    });
  }, [dateFrom, dateTo, debouncedSearch, orders, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / limit));
  const page = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * limit,
    page * limit,
  );

  const pendingOrders = filteredOrders.filter(
    (order) => order.orderStatus === "PENDING",
  );
  const deliveredOrders = filteredOrders.filter(
    (order) => order.orderStatus === "DELIVERED",
  );
  const revenue = filteredOrders
    .filter((order) => order.orderStatus !== "CANCELLED" && !order.canceled)
    .reduce(
      (sum, order) =>
        sum +
        order.products.reduce(
          (orderSum, product) => orderSum + product.lineTotal,
          0,
        ),
      0,
    );

  if (isLoading && !data) {
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
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-8">
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
            value={filteredOrders.length}
            badgeText="All"
            description="Orders matching the current filters."
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
            description="Gross order value from loaded non-cancelled orders."
            variant="blue"
          />
        </section>

        <div className="flex w-full flex-col gap-4 rounded-3xl border border-[#0089D3]/20 bg-white p-4 shadow-[0_8px_30px_rgba(0,137,211,0.08)] lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <input
              id="order-search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search order id, customer, phone, email, address, product, or status"
              className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px]">
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => {
                setDateFrom(event.target.value);
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              aria-label="Orders from date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(event) => {
                setDateTo(event.target.value);
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              aria-label="Orders to date"
            />
          </div>
          <CustomSelect<OrderStatus | "ALL">
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            className="md:w-56"
          />
          <select
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10 md:w-36"
            aria-label="Orders per page"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option} / page
              </option>
            ))}
          </select>
          {(searchQuery || statusFilter !== "ALL" || dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
            >
              Clear
            </button>
          )}
        </div>

        <OrdersTable
          orders={paginatedOrders}
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

        <div className="flex flex-col gap-3 rounded-2xl border border-[#D8EAF4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#64748B]">
            Showing page {page} of {totalPages} - {filteredOrders.length}{" "}
            matching orders
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() =>
                setCurrentPage((current) => Math.max(1, current - 1))
              }
              className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - page) <= 1,
              )
              .map((pageNumber, index, pages) => {
                const previousPage = pages[index - 1];
                const showGap = previousPage && pageNumber - previousPage > 1;

                return (
                  <span key={pageNumber} className="flex items-center gap-2">
                    {showGap ? (
                      <span className="px-1 text-sm font-bold text-[#94A3B8]">
                        ...
                      </span>
                    ) : null}
                    <button
                      type="button"
                      disabled={isFetching}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        page === pageNumber
                          ? "bg-[#0089D3] text-white"
                          : "border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FBFD]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}
            <button
              type="button"
              disabled={page >= totalPages || isFetching}
              onClick={() =>
                setCurrentPage((current) => Math.min(totalPages, current + 1))
              }
              className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
