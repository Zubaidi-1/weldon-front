import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Account Access",
  description:
    "Sign in, create an account, recover your password, and verify your Dr. Schrammek Jordan customer account.",
  path: "/auth/login",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
