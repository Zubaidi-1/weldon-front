import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Products Admin",
  description:
    "Manage Dr. Schrammek Jordan products, categories, stock, images, shades, pricing, and product status.",
  path: "/admin/products",
  noIndex: true,
});

export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
