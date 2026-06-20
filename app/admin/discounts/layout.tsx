import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Discounts Admin",
  description:
    "Create and manage Dr. Schrammek Jordan store, category, and product discounts.",
  path: "/admin/discounts",
  noIndex: true,
});

export default function AdminDiscountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
