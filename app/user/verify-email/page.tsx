"use client";

import { getApiUrl } from "@/config/api";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      window.location.replace("/auth/login?verified=false");
      return;
    }

    window.location.replace(
      getApiUrl(`/user/verify-email?token=${encodeURIComponent(token)}`),
    );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4 py-24">
      <p className="text-lg font-semibold text-[#64748B]">
        Verifying your email...
      </p>
    </main>
  );
}
