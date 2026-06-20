import AdminRouteGuard from "@/components/shared/auth/AdminRouteGuard";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description:
    "View administrative sales, orders, and customer metrics for Dr. Schrammek Jordan.",
  path: "/dashboard/admin",
  noIndex: true,
});

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
