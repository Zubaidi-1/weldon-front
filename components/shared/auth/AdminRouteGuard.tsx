"use client";

import { useAuth } from "@/Context/auth/authContext";
import { useGetMe } from "@/Hooks/user/useGetMe";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady } = useAuth();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetMe({ enabled: isReady });

  const isAdmin = user?.roleName === "ADMIN";
  const isSignedIn = Boolean(user?.id);
  const isCheckingAccess = !isReady || isLoading;

  useEffect(() => {
    if (isCheckingAccess || isAdmin) return;

    if (!isSignedIn || isError) {
      const redirectTo = encodeURIComponent(pathname);
      router.replace(`/auth/login?redirectTo=${redirectTo}`);
      return;
    }

    router.replace("/store");
  }, [isAdmin, isCheckingAccess, isError, isSignedIn, pathname, router]);

  if (isCheckingAccess || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-6 py-24">
        <p className="text-lg font-semibold text-[#64748B]">
          Checking admin access...
        </p>
      </main>
    );
  }

  return children;
}
