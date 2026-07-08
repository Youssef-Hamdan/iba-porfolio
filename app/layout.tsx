import type { Viewport } from "next";
import { Montserrat } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteReadyGate } from "@/components/SiteReadyGate";
import { rootMetadata } from "@/lib/seo";
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

export const metadata = rootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full`}>
      <body className="font-sans flex min-h-full flex-col antialiased">
        <JsonLd />
        <SiteReadyGate>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SiteReadyGate>
      </body>
    </html>
  );
}
