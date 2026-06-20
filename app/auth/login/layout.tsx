import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Login",
  description:
    "Log in to your Dr. Schrammek Jordan account to manage your profile, cart, and orders.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
