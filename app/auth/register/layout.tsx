import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create Account",
  description:
    "Create a Dr. Schrammek Jordan account for faster checkout, order tracking, and profile management.",
  path: "/auth/register",
  noIndex: true,
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
