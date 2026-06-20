"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getAssetUrl } from "@/config/api";
import { useAuth } from "@/Context/auth/authContext";
import { useGetMe } from "@/Hooks/user/useGetMe";
import {
  useCancelUserOrder,
  useGetUserOrders,
} from "@/Hooks/user/useGetUserOrder";
import type {
  OrderStatus,
  UserOrderProduct,
  UserOrder,
} from "@/lib/types/OrderTypes";
import { formatProductSize } from "@/lib/utils/productSize";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-[#FFF7D6] text-[#A16207] border-[#FDE68A]",
  CONFIRMED: "bg-[#E7F5FF] text-[#0077B6] border-[#BFE4F8]",
  SHIPPED: "bg-[#F1EEFF] text-[#6D28D9] border-[#DDD6FE]",
  DELIVERED: "bg-[#EAF8EF] text-[#15803D] border-[#BBF7D0]",
  CANCELLED: "bg-[#FFF1F2] text-[#BE123C] border-[#FFE4E6]",
};

const ONE_HOUR = 60 * 60 * 1000;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const toNumber = (value: number | string) => {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
};

const formatMoney = (value: number | string) =>
  `$${toNumber(value).toFixed(2)}`;

const getProductSize = (product: UserOrderProduct) => product.productSize;

const getLineTotal = (product: UserOrderProduct) =>
  toNumber(product.productPrice) * product.quantity;

const getOrderProducts = (order: UserOrder) => order.orderLine?.products ?? [];

const getOrderTotal = (order: UserOrder) =>
  getOrderProducts(order).reduce(
    (sum, product) => sum + getLineTotal(product),
    0,
  );

const getOrderQuantity = (order: UserOrder) =>
  getOrderProducts(order).reduce((sum, product) => sum + product.quantity, 0);

const getCancelInfo = (order: UserOrder) => {
  const createdAt = new Date(order.createdAt).getTime();
  const expiresAt = createdAt + ONE_HOUR;
  const remainingMs = expiresAt - Date.now();
  const canCancel =
    order.orderStatus === "PENDING" && !order.canceled && remainingMs > 0;
  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000));

  return { canCancel, remainingMinutes };
};

export default function MyOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { isReady } = useAuth();
  const { data: user, isLoading: isMeLoading } = useGetMe({ enabled: isReady });

  const isSignedIn = Boolean(user?.id);
  const { data: orders, isLoading: isOrdersLoading } = useGetUserOrders({
    enabled: isReady && isSignedIn,
  });
  const cancelOrder = useCancelUserOrder();

  const sortedOrders = useMemo(
    () =>
      [...(orders ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  const selectedOrder =
    sortedOrders.find((order) => order.orderId === selectedOrderId) ?? null;

  if (isMeLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F6F9FC] px-4 py-24">
        <p className="text-sm font-semibold text-[#64748B]">
          Loading account...
        </p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F6F9FC] px-4 py-24">
        <section className="w-full max-w-md rounded-2xl border border-[#D8EAF4] bg-white p-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          <h1 className="text-2xl font-bold text-[#0F172A]">My Orders</h1>
          <p className="mt-3 text-sm font-semibold text-[#64748B]">
            Sign in to view your orders.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0089D3] px-6 text-sm font-bold text-white transition hover:bg-[#007BBE]"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F6F9FC] px-4 py-24 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 border-b border-[#D8EAF4] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0089D3]">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A] sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-[#64748B]">
              Open an order to review its products and cancellation options.
            </p>
          </div>
          <div className="rounded-xl border border-[#D8EAF4] bg-white px-4 py-3 text-sm font-bold text-[#0F172A] shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            {sortedOrders.length} total orders
          </div>
        </header>

        {isOrdersLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white"
              />
            ))}
          </div>
        ) : sortedOrders.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {sortedOrders.map((order) => {
              const { canCancel, remainingMinutes } = getCancelInfo(order);
              const productCount = getOrderProducts(order).length;

              return (
                <li key={order.orderId}>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className="group flex h-full w-full flex-col rounded-2xl border border-[#D8EAF4] bg-white p-5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[#0089D3]/40 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-[#0F172A]">
                          Order #{order.orderId}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#64748B]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[order.orderStatus]}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-[#F6F9FC] p-3">
                        <p className="text-xs font-semibold text-[#64748B]">
                          Items
                        </p>
                        <p className="mt-1 text-base font-bold text-[#0F172A]">
                          {getOrderQuantity(order)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#F6F9FC] p-3">
                        <p className="text-xs font-semibold text-[#64748B]">
                          Products
                        </p>
                        <p className="mt-1 text-base font-bold text-[#0F172A]">
                          {productCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#F6F9FC] p-3">
                        <p className="text-xs font-semibold text-[#64748B]">
                          Total
                        </p>
                        <p className="mt-1 text-base font-bold text-[#0089D3]">
                          {formatMoney(getOrderTotal(order))}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                      <p className="text-xs font-semibold text-[#64748B]">
                        {canCancel
                          ? `${remainingMinutes} min left to cancel`
                          : "View order details"}
                      </p>
                      <span className="text-sm font-bold text-[#0089D3] transition group-hover:translate-x-1">
                        Open
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#BFDCEB] bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-[#0F172A]">
              No orders found
            </h2>
            <p className="mt-2 max-w-md text-sm font-medium text-[#64748B]">
              Your completed checkout orders will appear here.
            </p>
            <Link
              href="/store"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0089D3] px-6 text-sm font-bold text-white transition hover:bg-[#007BBE]"
            >
              Browse store
            </Link>
          </div>
        )}
      </section>

      {selectedOrder ? (
        <OrderDetailsModal
          order={selectedOrder}
          isCancelling={
            cancelOrder.isPending &&
            cancelOrder.variables === selectedOrder.orderId
          }
          onCancel={() => cancelOrder.mutate(selectedOrder.orderId)}
          onClose={() => setSelectedOrderId(null)}
        />
      ) : null}
    </main>
  );
}

function OrderDetailsModal({
  order,
  isCancelling,
  onCancel,
  onClose,
}: {
  order: UserOrder;
  isCancelling: boolean;
  onCancel: () => void;
  onClose: () => void;
}) {
  const products = getOrderProducts(order);
  const { canCancel, remainingMinutes } = getCancelInfo(order);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/55 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      onMouseDown={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex flex-col gap-4 border-b border-[#E2E8F0] px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0089D3]">
              Order details
            </p>
            <h2
              id="order-details-title"
              className="mt-2 text-2xl font-bold text-[#0F172A]"
            >
              Order #{order.orderId}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[order.orderStatus]}`}
            >
              {order.orderStatus}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] text-xl font-semibold text-[#64748B] transition hover:bg-[#F8FAFC]"
              aria-label="Close order details"
            >
              x
            </button>
          </div>
        </header>

        <div className="max-h-[calc(90vh-185px)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FBFD] p-4">
              <p className="text-xs font-semibold text-[#64748B]">Items</p>
              <p className="mt-1 text-xl font-bold text-[#0F172A]">
                {getOrderQuantity(order)}
              </p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FBFD] p-4">
              <p className="text-xs font-semibold text-[#64748B]">Products</p>
              <p className="mt-1 text-xl font-bold text-[#0F172A]">
                {products.length}
              </p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FBFD] p-4">
              <p className="text-xs font-semibold text-[#64748B]">Total</p>
              <p className="mt-1 text-xl font-bold text-[#0089D3]">
                {formatMoney(getOrderTotal(order))}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {products.map((product) => {
              const productSize = getProductSize(product);

              return (
                <article
                  key={`${product.productId}-${product.id}`}
                  className="grid gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:grid-cols-[88px_1fr_auto]"
                >
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FBFD] sm:h-22 sm:w-22">
                    {product.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getAssetUrl(product.productImage)}
                        alt={product.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-[#94A3B8]">
                        No image
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {product.productName}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#64748B]">
                      Qty {product.quantity}
                      {productSize
                        ? ` - Size ${formatProductSize(productSize)}`
                        : ""}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#64748B]">
                      {formatMoney(product.productPrice)} each
                    </p>
                  </div>
                  <p className="self-start text-base font-bold text-[#0089D3] sm:text-right">
                    {formatMoney(getLineTotal(product))}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#E2E8F0] bg-[#F8FBFD] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm font-semibold text-[#64748B]">
            {canCancel
              ? `Pending orders can be cancelled for ${remainingMinutes} more minutes.`
              : "Cancellation is only available for pending orders within 1 hour."}
          </p>
          <button
            type="button"
            onClick={onCancel}
            disabled={!canCancel || isCancelling}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#E11D48] px-5 text-sm font-bold text-white transition hover:bg-[#BE123C] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
          >
            {isCancelling ? "Cancelling..." : "Cancel order"}
          </button>
        </footer>
      </section>
    </div>
  );
}
