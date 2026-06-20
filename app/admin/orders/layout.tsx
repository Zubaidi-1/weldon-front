import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Orders Admin",
  description:
    "Review, search, filter, and update Dr. Schrammek Jordan customer orders.",
  path: "/admin/orders",
  noIndex: true,
});

export default function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
