import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteReadyGate } from "@/components/SiteReadyGate";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "International Business Alliance",
  description:
    "Nous connectons les gouvernements, les industries et les capitaux pour bâtir une économie mondiale résiliente, transparente et durable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://player.vimeo.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.vimeocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://f.vimeocdn.com" />
      </head>
      <body className="font-sans flex min-h-full flex-col antialiased">
        <SiteReadyGate>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SiteReadyGate>
      </body>
    </html>
  );
}
