import type { Metadata } from "next";

const siteName = "Dr. Schrammek Jordan";
const defaultDescription =
  "Shop professional Dr. Schrammek skincare in Jordan, including Green Peel, sensitive skin care, hydrating treatments, body care, ampoules, and advanced German skincare products.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://drschrammek-jordan.com";

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export const createPageMetadata = ({
  title,
  description,
  path = "/",
  noIndex = false,
}: PageMetadataInput): Metadata => {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Professional German Skincare`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "Dr. Schrammek Jordan",
    "Dr. Schrammek",
    "Jordan skincare",
    "German skincare",
    "Green Peel",
    "professional skincare",
    "sensitive skin",
    "hydrating skincare",
    "anti-aging skincare",
    "body care",
    "ampoules",
  ],
  openGraph: {
    title: `${siteName} | Professional German Skincare`,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Professional German Skincare`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/top.webp",
        type: "image/webp",
      },
    ],
    shortcut: "/top.webp",
    apple: "/top.webp",
  },
};
