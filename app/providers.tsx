"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "@/Context/profile/profileContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <Toaster
          position="top-right"
          containerStyle={{
            top: 96,
            zIndex: 99999,
          }}
        />
        {children}
      </ProfileProvider>
    </QueryClientProvider>
  );
}
