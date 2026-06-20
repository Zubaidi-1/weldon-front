import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_Arabic,
  Noto_Serif,
} from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "./providers";
import { AuthProvider } from "@/Context/auth/authContext";
import { rootMetadata } from "@/lib/seo";
import { LanguageProvider } from "@/Context/language/languageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = rootMetadata;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col w-full"
        suppressHydrationWarning
      >
        <AuthProvider>
          <LanguageProvider>
            <Providers>
              <Nav />
              {children}
            </Providers>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
