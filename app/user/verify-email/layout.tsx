import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Verify Email",
  description:
    "Verify your Dr. Schrammek Jordan account email address to finish securing your customer profile.",
  path: "/user/verify-email",
  noIndex: true,
});

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
