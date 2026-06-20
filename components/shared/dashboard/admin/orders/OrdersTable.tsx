import type { Order, OrderStatus } from "@/lib/types/OrderTypes";

type OrdersTableProps = {
  orders: Order[];
  title?: string;
  onStatusChange?: (orderId: number, status: OrderStatus) => void;
  updatingOrderId?: number | null;
};

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-[#FEF3C7] text-[#D97706]",
  CONFIRMED: "bg-[#E6F6FD] text-[#0089D3]",
  SHIPPED: "bg-[#EDE9FE] text-[#7C3AED]",
  DELIVERED: "bg-[#DCFCE7] text-[#16A34A]",
  CANCELLED: "bg-[#FEE2E2] text-[#DC2626]",
};

const editableStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function OrdersTable({
  orders,
  title = "Orders",
  onStatusChange,
  updatingOrderId = null,
}: OrdersTableProps) {
  return (
    <section className="w-full overflow-hidden rounded-3xl border border-[#0089D3]/20 bg-white shadow-[0_8px_30px_rgba(0,137,211,0.10)]">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
          <p className="mt-1 text-sm text-[#64748B]">
            {orders.length} orders shown
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1450px] border-collapse">
          <thead className="bg-[#F0F9FF]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Order
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Governate
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Items
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Created
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] bg-white">
            {orders.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    No orders found
                  </h3>
                  <p className="mt-2 text-sm text-[#64748B]">
                    New checkout orders will appear here.
                  </p>
                </td>
              </tr>
            )}

            {orders.map((order) => {
              const total = order.products.reduce(
                (sum, product) => sum + product.lineTotal,
                0,
              );
              const itemCount = order.products.reduce(
                (sum, product) => sum + product.quantity,
                0,
              );

              return (
                <tr
                  key={order.orderId}
                  className="transition hover:bg-[#F8FBFD]"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#0F172A]">
                    #{order.orderId}
                  </td>
                  <td className="min-w-52 px-6 py-4 text-sm font-semibold text-[#0F172A]">
                    {order.orderFirstName} {order.orderLastName}
                    <span className="mt-1 block text-xs font-medium text-[#94A3B8]">
                      {order.userId ? `User #${order.userId}` : "Guest"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#334155]">
                    {order.orderPhoneNumber}
                  </td>
                  <td className="min-w-60 px-6 py-4 text-sm font-medium text-[#334155]">
                    {order.orderEmail}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#334155]">
                    {order.orderGovernate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#334155]">
                    {itemCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#0089D3]">
                    ${total.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {onStatusChange ? (
                      <select
                        value={order.orderStatus}
                        disabled={updatingOrderId === order.orderId}
                        onChange={(event) =>
                          onStatusChange(
                            order.orderId,
                            event.target.value as OrderStatus,
                          )
                        }
                        className={`h-9 rounded-full border-0 px-3 text-xs font-bold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${statusStyles[order.orderStatus]}`}
                      >
                        {editableStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[order.orderStatus]}`}
                      >
                        {order.orderStatus}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#334155]">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
