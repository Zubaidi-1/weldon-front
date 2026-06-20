import AdminRouteGuard from "@/components/shared/auth/AdminRouteGuard";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Admin Dashboard",
  description:
    "Manage Dr. Schrammek Jordan products, orders, customers, stock, and store operations.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
