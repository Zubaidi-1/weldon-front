import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Users Admin",
  description:
    "Manage Dr. Schrammek Jordan customer and admin accounts, verification, roles, and access status.",
  path: "/admin/users",
  noIndex: true,
});

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
