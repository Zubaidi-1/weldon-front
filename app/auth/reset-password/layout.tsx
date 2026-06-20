import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Reset Password",
  description:
    "Set a new password for your Dr. Schrammek Jordan customer account.",
  path: "/auth/reset-password",
  noIndex: true,
});

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
