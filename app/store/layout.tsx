import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Store",
  description:
    "Shop Dr. Schrammek Jordan products across Green Peel, sensitive skin, hydrating care, ampoules, body care, and professional skincare categories.",
  path: "/store",
});

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
