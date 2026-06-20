import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "My Orders",
  description:
    "Review your Dr. Schrammek Jordan order history, order details, status updates, and purchased products.",
  path: "/profile/orders",
  noIndex: true,
});

export default function ProfileOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
