import type { NextConfig } from "next";

const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
);

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
