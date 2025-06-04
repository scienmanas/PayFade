import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/app/globals.css";
import { Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL as string),
  title: `${process.env.SITE_NAME} | Home`,
  description:
    "FayPade is an Open Source platform to help you change the website opacity if the client does't pay for your service.",
  keywords: [
    "PayFade",
    "website opacity tool",
    "adjust opacity",
    "client payment",
    "client did not pay",
    "open source tool",
  ],
  authors: [
    {
      name: "Manas",
      url: "https://scienmanas.xyz",
    },
    {
      name: "Nikhil Srivastava",
      url: "https://nikhilsrv.page",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: `${process.env.SITE_NAME} | Home`,
    description:
      "FayPade is an Open Source platform to help you change the website opacity if the client does't pay for your service.",
    url: process.env.BASE_URL,

    type: "article",
    siteName: `${process.env.SITE_NAME}`,
    locale: "en_US",
    authors: ["Manas", "Nikhil Srivastava"],
  },
  twitter: {
    card: "summary",

    title: `${process.env.SITE_NAME} | Home`,
    description:
      "FayPade is an Open Source platform to help you change the website opacity if the client does't pay for your service.",
    creator: "@scienmanas",
    site: process.env.SITE_ENV,
  },
};

export const viewport: Viewport = {
  themeColor: "white",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics
        debugMode={process.env.NODE_ENV === "development" ? true : false}
        gaId={process.env.G_ANALYTICS_ID as string}
      />
      <body className="antialiased w-full h-fit bg-slate-200">{children}</body>
    </html>
  );
}
