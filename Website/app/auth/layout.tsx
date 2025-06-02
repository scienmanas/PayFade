import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL as string),
  title: `Signin - ${process.env.SITE_NAME}`,
  description:
    "Sign in to FayPade  an Open Source platform to help you change the website opacity if the client does't pay for your service.",
  keywords: [
    "signin",
    "login",
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
    title: `Signin - ${process.env.SITE_NAME}`,
    description:
      "Sign in to FayPade  an Open Source platform to help you change the website opacity if the client does't pay for your service.",
    url: process.env.BASE_URL,

    type: "article",
    siteName: `${process.env.SITE_NAME}`,
    locale: "en_US",
    authors: ["Manas", "Nikhil Srivastava"],
  },
  twitter: {
    card: "summary",
    title: `Signin - ${process.env.SITE_NAME}`,
    description:
      "Sign in to FayPade  an Open Source platform to help you change the website opacity if the client does't pay for your service.",
    creator: "@scienmanas",
    site: process.env.SITE_ENV,
  },
};

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full h-fit">{children}</div>;
}
