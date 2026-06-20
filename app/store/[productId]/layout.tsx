import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Product Details",
  description:
    "View product details, images, shades, size, stock, and pricing for a Dr. Schrammek Jordan skincare product.",
  path: "/store",
});

export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
