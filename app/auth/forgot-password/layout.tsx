import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Forgot Password",
  description:
    "Request a password reset email for your Dr. Schrammek Jordan account.",
  path: "/auth/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
