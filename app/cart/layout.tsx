import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cart",
  description:
    "Review your Dr. Schrammek Jordan skincare cart, update quantities, and continue to checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
