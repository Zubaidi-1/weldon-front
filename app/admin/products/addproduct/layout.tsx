import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Add Product",
  description:
    "Create a new Dr. Schrammek Jordan product with categories, images, shades, stock, pricing, and product details.",
  path: "/admin/products/addproduct",
  noIndex: true,
});

export default function AddProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
