"use client";

import ProductDashboardCard from "@/components/shared/dashboard/admin/products/ProductCards";
import { useGetOrders } from "@/Hooks/order/useGetOrders";
import { useGetAllProducts } from "@/Hooks/products/useGetAllProducts";
import type { Product, ProductStatus } from "@/lib/types/ProductTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getProductStatus(product: Product): ProductStatus {
  if (product.productStatus === "OUT_OF_STOCK" || product.stockQuantity <= 5) {
    return "OUT_OF_STOCK";
  }

  return product.productStatus;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const productsQuery = useGetAllProducts();
  const ordersQuery = useGetOrders(1, 5);

  const products = productsQuery.data ?? [];
  const orders = ordersQuery.data?.orders ?? [];
  const isLoading = productsQuery.isLoading || ordersQuery.isLoading;
  const isError = productsQuery.isError || ordersQuery.isError;

  const activeProducts = products.filter(
    (product) => getProductStatus(product) === "ACTIVE",
  );
  const outOfStockProducts = products.filter(
    (product) => getProductStatus(product) === "OUT_OF_STOCK",
  );
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING",
  );
  const revenue = orders
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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load dashboard
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
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Track product health and recent order activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0089D3] px-4 text-sm font-bold text-white transition hover:bg-[#007BBE]"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
            >
              Orders
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
            >
              Users
            </Link>
            <Link
              href="/admin/discounts"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
            >
              Discounts
            </Link>
          </div>
        </header>

        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ProductDashboardCard
            title="Products"
            value={products.length}
            badgeText="Catalog"
            description={`${activeProducts.length} active products are currently visible to customers.`}
            buttonText="View products"
            onClick={() => {
              router.push("/admin/products");
            }}
            variant="blue"
          />
          <ProductDashboardCard
            title="Low / Out Stock"
            value={outOfStockProducts.length}
            badgeText="Stock"
            description="Products at or below the sellable stock buffer."
            buttonText="Manage stock"
            onClick={() => {
              router.push("/admin/products");
            }}
            variant="red"
          />
          <ProductDashboardCard
            title="Orders"
            value={ordersQuery.data?.total ?? orders.length}
            badgeText="Orders"
            description={`${pendingOrders.length} pending orders in the latest loaded batch.`}
            buttonText="View orders"
            onClick={() => {
              router.push("/admin/orders");
            }}
            variant="yellow"
          />
          <ProductDashboardCard
            title="Recent Revenue"
            value={`$${revenue.toFixed(2)}`}
            badgeText="Sales"
            description="Gross value from the latest loaded non-cancelled orders."
            buttonText="Open orders"
            onClick={() => {
              router.push("/admin/orders");
            }}
            variant="green"
          />
        </section>

        <section className="rounded-2xl border border-[#D8EAF4] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Discounts
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Manage sales and send customer reminders.
              </p>
            </div>
            <Link
              href="/admin/discounts"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0089D3] px-4 text-sm font-bold text-white transition hover:bg-[#007BBE]"
            >
              Manage discounts
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
