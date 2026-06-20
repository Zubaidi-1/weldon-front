import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Verify Registration",
  description:
    "Confirm your registration verification code for your Dr. Schrammek Jordan account.",
  path: "/auth/register/verify",
  noIndex: true,
});

export default function RegisterVerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
