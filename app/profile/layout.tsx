import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Profile",
  description:
    "Manage your Dr. Schrammek Jordan profile, contact details, and customer account information.",
  path: "/profile",
  noIndex: true,
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
